import { useLoaderData } from "react-router-dom";
import { getMenu } from "../../services/apiRestaurant";
import MenuItem from "../menu/MenuItem";

function Menu() {
  const menu = useLoaderData();
  return (
    <ul className="divide-y divide-stone-200 px-2">
      {menu.map((pizza) => (
        <MenuItem pizza={pizza} key={pizza.id} />
      ))}
    </ul>
  );
}
//loader render data before the component is rendered. This is useful for fetching data that the component needs to render, so that the component doesn't have to handle loading states or errors itself. Instead, the loader can handle those concerns and provide the component with the data it needs to render.
export async function loader() {
  const menu = await getMenu();
  return menu;
}
export default Menu;
