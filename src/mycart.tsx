import { CoreAttr, MarketPlaceAttr } from "@infa-mdp/model-types";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useCartService from
"../../../components/common/compare/hooks/useCartService";
import { MessageType } from
"../../../components/core/message/Message";
import i18nKeys from "../../../i18n/main/i18nKeys";
import { useLocaleContext } from "../../ui/locale/LocaleContext";
import { useToastNotificationContext } from
"../../ui/toast_notification_context/ToastNotificationContext";
import { cartConfig } from "./config";

export enum ACTIONS {
  ADD = "ADD",
  REMOVE = "REMOVE",
  REMOVE_ALL = "REMOVE_ALL",
}

export enum OPERATION_TYPE {
  ADD = "ADD",
  UPDATE = "UPDATE",
}

interface CartContextInitialState {
  state: {
    expandedSections: Record<string, boolean>;
    containers: Record<string, { name: string; expanded: boolean }>;
    cartDetail?: { cartId: string; cartStatus: string; unpublishedIds?:
string[] };
    dcQueue: string[];
    loadingIds: Set<string>;
    isActiveCheckout: boolean;
    setIsActiveCheckout:
React.Dispatch<React.SetStateAction<boolean>>;
    setCartDetail: React.Dispatch<
      React.SetStateAction<
        { cartId: string; cartStatus: string; unpublishedIds?: string[] } |
undefined
      >
    >;
  };
  toggleSectionExpand: (id: string) => void;
  toggleContainerExpand: (id: string) => void;
  addOrRemoveCartItem: (
    ids: string[],
    action: ACTIONS,
    name?: string,
    operationType?: OPERATION_TYPE
  ) => void;
  toggleAllContainers: (expand: boolean) => void;
  reload: () => void;
}

const Context = createContext<CartContextInitialState>({} as
CartContextInitialState);

export const useCartContext = (): CartContextInitialState =>
  useContext(Context) as CartContextInitialState;

const CartContext: React.FC<PropsWithChildren> = ({ children }) => {
  const { pushNotification } = useToastNotificationContext();
  const [expandedSections, setExpandedSections] =
React.useState<Record<string, boolean>>(
      cartConfig.sections.reduce((acc, section) => {
        acc[section.key] = true;
        return acc;
      }, {} as Record<string, boolean>)
  );
  const { t } = useLocaleContext();
  const [containers, setContainers] = React.useState<
    Record<string, { name: string; expanded: boolean }>
  >({});
  const [refresh, setRefresh] = useState(0);
  const [cartDetail, setCartDetail] = React.useState<
    { cartId: string; cartStatus: string; unpublishedIds?: string[] } |
undefined
  >(undefined);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new
Set());
  const [isActiveCheckout, setIsActiveCheckout] =
useState<boolean>(false);

  const dcQueueRef = useRef<Set<string>>(new Set());
  const processingIdsRef = useRef<Map<string, { name: string |
undefined; action: ACTIONS }>>(
      new Map()
  );
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const pendingIdsRef = useRef<string[] | null>(null);
  const cartService = useCartService();

  const fetchCart = React.useCallback(async () => {
    try {
      const cart = await cartService.load();
      const items = cart?.[MarketPlaceAttr.DataCollectionIds] || [];
      setContainers(
        items.reduce((acc, id) => {
          acc[id] = { name: "", expanded: true };
          return acc;
        }, {} as Record<string, { name: string; expanded: boolean }>)
      );
      setCartDetail({
        cartId: cart?.[CoreAttr.Identity],
        cartStatus: cart?.[MarketPlaceAttr.CartStatus],
      });
      dcQueueRef.current = new Set(items);
    } catch (e) {
      pushNotification({
        message: t(i18nKeys.FAILED_TO_FETCH_CART),
        type: MessageType.ERROR,
      });
    }
  }, [cartService]);

  useEffect(() => {
    fetchCart();
  }, [refresh]);

  // Filter out unpublishedIds that are no longer in the cart
  useEffect(() => {
    if (cartDetail?.unpublishedIds?.length) {
      const containerIds = Object.keys(containers);
      const filtered = cartDetail.unpublishedIds.filter((id) =>
containerIds.includes(id));
      if (filtered.length !== cartDetail.unpublishedIds.length) {
        setCartDetail((prev) => (prev ? { ...prev, unpublishedIds:
filtered } : prev));
      }
    }
  }, [containers]);

  const methods = React.useMemo(
    () => ({
      addOrRemoveCartItem: (
        ids: string[],
        action: ACTIONS,
        name?: string,
        operationType?: OPERATION_TYPE
      ) => {
        // For REMOVE_ALL, use all current container IDs
        const idsToProcess =
          action === ACTIONS.REMOVE_ALL ?
Array.from(dcQueueRef.current) : ids;

        // Track loading for specific IDs
        setLoadingIds((prev) => {
          const updated = new Set(prev);
          idsToProcess.forEach((id) => updated.add(id));
          return updated;
          // store name and action for use later
          // processingIdsRef.current.
        // { name, action }));
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }

        const executeApiCall = async () => {
          if (pendingIdsRef.current !== null) {
            return;
          }
          const finalIds = Array.from(dcQueueRef.current);
          const isAddOperation = operationType ===
OPERATION_TYPE.ADD;
          if (operationType === OPERATION_TYPE.ADD) {
            cartService.refreshCache();
          }
          // Capture IDs to clear loading for at start of this call
          const idsToStopLoading = new
Set(Array.from(processingIdsRef.current.keys()));
          const idToNameInThisCall = new
Map(processingIdsRef.current);
          processingIdsRef.current.clear();

          // Store the IDs we're sending (non-null marks processing
as active)
          pendingIdsRef.current = finalIds;
          try {
            isAddOperation
              ? await cartService.add(finalIds)
              : await cartService.update(finalIds, cartDetail?.cartId ||
"");

            if (ids?.length > 1) {
              //Case when added from search other items(All all to
cart)
              pushNotification({
                //TODO : message need to change
                message:
t(i18nKeys.COMPARE_ALL_MULTI_COLLECTIONS_INFO_MESSAGE),
                type: MessageType.SUCCESS,
              });
            } else {
              idsToStopLoading.forEach((id) => {
                idToNameInThisCall.get(id)?.action ===
ACTIONS.ADD &&
                  pushNotification({
                    message:
t(i18nKeys.ITEM_SENT_TO_CART_MESSAGE, {
                      DC_name: idToNameInThisCall.get(id)?.name ||
"",
                    }),
                    type: MessageType.SUCCESS,
                  });
              });
            }

            // Sync containers with dcQueueRef (source of truth)
            setContainers((prev) => {
              const updated: Record<string, { name: string;
expanded: boolean }> = {};
              finalIds.forEach((id) => {
                // Preserve existing container data, or create new
entry
                updated[id] = prev[id] || { expanded: true, name: "" };
              });
              return updated;
            });
            //for item delete dont need to show message as ui shows
not added to cart white background and we have tootip to explain it
added to cart or not
          } catch (e) {
            pendingIdsRef.current = null;
            // set cnotainers to dcqueueRef as source of truth to
revert any UI changes
            dcQueueRef.current = new Set(Object.keys(containers));
            pushNotification({
              message:
t(i18nKeys.FAILED_TO_ADD_DATA_COLLECTIONS_TO_CART),
              type: MessageType.ERROR,
            });
            throw e;
          } finally {
            // Clear loading for all IDs that were being processed in
this call
            setLoadingIds((prev) => {
              const updated = new Set(prev);
              idsToStopLoading.forEach((id) => updated.delete(id));
              return updated;
            });
          }

          // Check if queue changed during API call
          const currentIds = Array.from(dcQueueRef.current);
          const sentIds = pendingIdsRef.current || [];
          pendingIdsRef.current = null;

          const hasChanged =
            currentIds.length !== sentIds.length &&
            !currentIds.every((id) => sentIds.includes(id));

          if (hasChanged) {
            // Queue changed during API call, trigger another update
            executeApiCall();
            return;
          }
        };

        debounceRef.current = setTimeout(executeApiCall, 2000);
      },
      toggleSectionExpand: (id: string): void => {
        //Toggle expanded state of section
        setExpandedSections((prev) => ({
          ...prev,
          [id]: !prev[id],
        }));
      },
      toggleContainerExpand: (id: string): void => {
        // only toggle expanded state of container
        setContainers((prev) => {
          const container = prev[id];
          if (!container) return prev;
          return {
            ...prev,
            [id]: { ...container, expanded: !container.expanded },
          };
        });
      },
      toggleAllContainers: (expand: boolean): void => {
        setContainers((prev) => {
          const updated = { ...prev };
          Object.keys(updated).forEach((key) => {
            updated[key] = { ...updated[key], expanded: expand };
          });
          return updated;
        });
      },
      reload: () => {
        setRefresh((prev) => prev + 1);
      },
    }),
    [containers, expandedSections, setContainers, fetchCart]
  );

  const value = React.useMemo(
    () => ({
      state: {
        expandedSections,
        containers,
        cartDetail,
        dcQueue: dcQueueRef.current ?
Array.from(dcQueueRef.current) : [],
        loadingIds,
        isActiveCheckout,
        setIsActiveCheckout,
        setCartDetail,
      },
      ...methods,
    }),
    [methods, cartDetail, loadingIds, isActiveCheckout]
  );

  return <Context.Provider value={value}>{children}
</Context.Provider>;
};

export default CartContext;