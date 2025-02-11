interface searchProps {
    placeholder: string;
    column: string;
  }
  interface filtersProps {
    column: string;
    title: string;
    options: optionsProps[];
  }
  interface optionsProps{
    value: string;
    label: string;
    icon: any;
  }
  
  
  export const viewOption = false;
  
  const search: searchProps = {
    placeholder: "Filter category...",
    column: "categoryName",
  };
  
  export { search };
  