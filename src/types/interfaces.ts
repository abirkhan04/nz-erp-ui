
export interface MenuItemType {
  label: string;
  icon?: any;
  path?: string;
  children?: MenuItemType[];
};


export interface Company {
  name: string;
  address: string;
  id: string;
}