import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="p-4 border-b">
      <NavigationMenu>
        <NavigationMenuList className="space-x-6 flex">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/" className="text-lg font-medium hover:text-blue-500">Overview</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/symptoms" className="text-lg font-medium hover:text-blue-500">Symptoms</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/causes" className="text-lg font-medium hover:text-blue-500">Causes</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/diagnosis" className="text-lg font-medium hover:text-blue-500">Diagnosis</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/lifestyle" className="text-lg font-medium hover:text-blue-500">Lifestyle</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};

export default Navbar;
