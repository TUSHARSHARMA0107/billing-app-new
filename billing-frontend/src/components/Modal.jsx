export default function Modal ({ open,onClose,children}){
      if (!open)return null;

      return(
            <div className="fixed left-0 top -0 w-fulll h-full bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow -lg min-w-[350px]">
                  {children}
                  <button
                  onClick={onClose}
                  className="mt-4bg-gray-300 dark:bg-gray-700 tet-black dark:text-white px-4 py-2 rounded">
                        Close
                  </button>
            </div>
            </div>
      );
}