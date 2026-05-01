
export interface MenuItemType {
  label: string;
  icon?: any;
  url?: string;
  path?: string;
  children?: MenuItemType[];
};


export interface Company {
  name: string;
  address: string;
  id: string;
}

export interface Department {
  name: string;
}
