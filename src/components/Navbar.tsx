import { Bell, PanelLeftClose } from "lucide-react";
import Image from "next/image";

const Navbar = ({ toggleMenu }: { toggleMenu: () => void }) => {
  return (
    <div className="flex items-center justify-between p-4">
      {/* BUTTON */}
      <div
        onClick={toggleMenu}
        className="lg:hidden bg-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
      >
        <PanelLeftClose color="grey" size={20} />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6 justify-end w-full">
        {/* DARK MODE TOGGLE 
        <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer'>
          <Image src="/message.png" alt="" width={20} height={20}/>
        </div> 
        <div className='bg-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer relative'>
          <Bell color="grey" size={20}/>
          <div className='absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs'>1</div>
        </div>*/}
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">John Doe</span>
          <span className="text-[10px] text-gray-500 text-right">
            Cardiologista
          </span>
        </div>
        <Image
          src="/avatar.png"
          alt=""
          width={36}
          height={36}
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default Navbar;
