import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { decreaseIemQuantity, increaseItemQuantity } from "./cartSlice";

function UpdateItemQuantities({ id, currentQuantity }) {
  const dispatch = useDispatch();
  return (
    <div className="flex items-center gap-2 md:gap-3.5">
      <Button type="round" onClick={() => dispatch(decreaseIemQuantity(id))}>
        -
      </Button>
      <span className="text-sm font-medium">{currentQuantity}</span>
      <Button type="round" onClick={() => dispatch(increaseItemQuantity(id))}>
        +
      </Button>
    </div>
  );
}

export default UpdateItemQuantities;
