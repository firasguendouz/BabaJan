import './MenuActions.css';

const MenuActions = ({ setEditProduct }) => {
    const handleAddProduct = () => {
      setEditProduct({}); // Open ProductEditModal with an empty product object
    };
  
    return (
      <div>
        <button onClick={handleAddProduct}>Add New Product</button>
      </div>
    );
  };
  
  export default MenuActions;
  