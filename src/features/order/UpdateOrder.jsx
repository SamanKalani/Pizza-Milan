import { useFetcher } from "react-router-dom";
import Button from "../../ui/Button";
import { updateOrder } from "../../services/apiRestaurant";
function UpdateOrder() {
  //here we use fetcher to submit the form without navigating away from the current page. This allows us to update the order's priority status without losing the current state of the page or triggering a full page reload. The fetcher.Form component is used to create a form that will be submitted using the fetcher, and we specify the method as "PATCH" to indicate that we are updating an existing resource. When the form is submitted, the action function is called to handle the update logic.
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="PATCH" className="text-right">
      <Button type="primary">Make priority</Button>
    </fetcher.Form>
  );
}

export default UpdateOrder;

export async function action({ request, params }) {
  const data = { priority: true };
  await updateOrder(params.orderId, data);
  return null;
}
