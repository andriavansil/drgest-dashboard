export const ITEM_PER_PAGE = 10

type RouteAccessMap = {
  [key: string]: string[];
};

export const  routeAccessMap: RouteAccessMap = {
  "/med(.*)": ["med", "med-pro"],
  "/med-pro(.*)": ["med-pro"],
  "/list/pacients": ["med", "med-pro"],
  "/list/appointments": ["med", "med-pro"],
  "/list/history": ["med", "med-pro"],
  "/calendar(.*)": ["med", "med-pro"],
  "/user-profile(.*)": ["med", "med-pro"],
};