// src/components/features/chat/CategoryViews/DemoCategoriesView.tsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { localizationService } from "@/services/localizationService";
import { demoCategories } from "@/data/demoChat";
import InfoMessages from "./InfoMessages";

interface DemoCategoriesViewProps {
  onSelect?: (id: string, name: string) => void;
}

export default function DemoCategoriesView({ onSelect }: DemoCategoriesViewProps) {
  const [expandedInfo, setExpandedInfo] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      {/* Общий прокручиваемый блок */}
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-1 custom-scrollbar space-y-4">
        {/* Список демо-категорий */}
        <div className="text-white">
          {demoCategories.map(cat => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="block w-full text-left px-3 py-2 mb-2 border rounded hover:bg-gray-100 text-white"
              onClick={() => onSelect?.(cat.id, cat.name)}
            >
              {cat.name}
            </motion.button>
          ))}
        </div>

        {/* Информационный блок только для демо */}
        <div className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="border border-green-500 rounded-2xl p-4 text-green-500 italic text-sm"
          >
            <div className="flex justify-between items-center">
              <button
                onClick={() => setExpandedInfo(!expandedInfo)}
                className="text-white hover:text-green-500 text-base font-medium transition-colors duration-200"
              >
                {expandedInfo
                  ? localizationService.get("HideInfo")
                  : localizationService.get("ShowInfo")}
              </button>
            </div>

            <AnimatePresence initial={false}>
              {expandedInfo && (
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <InfoMessages type="demo" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// // src/components/features/chat/CategoryViews/DemoCategoriesView.tsx
// import { useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { localizationService } from "@/services/localizationService";
// import { demoCategories } from "@/data/demoChat";
// import InfoMessages from "./InfoMessages";

// interface DemoCategoriesViewProps {
//   onSelect?: (id: string, name: string) => void;
// }

// export default function DemoCategoriesView({ onSelect }: DemoCategoriesViewProps) {
//   const [expandedInfo, setExpandedInfo] = useState(false);

//   return (
//     <div className="text-white">
//       {demoCategories.map(cat => (
//         <button
//           key={cat.id}
//           className="block w-full text-left px-3 py-2 mb-2 border rounded hover:bg-gray-100 text-white"
//           onClick={() => onSelect?.(cat.id, cat.name)}
//         >
//           {cat.name}
//         </button>
//       ))}

//       {/* Информационный блок только для демо */}
//       <div className="mt-6">
//           <div className="mt-6">
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.3 }}
//               className="border border-green-500 rounded-2xl p-4 text-green-500 italic text-sm"
//             >
//               <div className="flex justify-between items-center">
//                 <button
//                   onClick={() => setExpandedInfo(!expandedInfo)}
//                   className="text-white hover:text-green-500 text-base font-medium transition-colors duration-200"
//                 >
//                   {expandedInfo
//                     ? localizationService.get("HideInfo")
//                     : localizationService.get("ShowInfo")}
//                 </button>
//               </div>

//               <AnimatePresence initial={false}>
//                 {expandedInfo && (
//                   <motion.div
//                     className="mt-4"
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: "auto" }}
//                     exit={{ opacity: 0, height: 0 }}
//                   >
//                     <InfoMessages type="demo" />
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//             </motion.div>
//           </div>
//         </div>

//     </div>
//   );
// }
