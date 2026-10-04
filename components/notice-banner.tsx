// 'use client'

// import { useState, useEffect } from 'react'
// import { X } from 'lucide-react'
// import axios from 'axios'
// interface NoticeBannerProps {
//   title: string
//   message: string
//   type: 'info' | 'warning' | 'maintenance' | 'critical'
//   isActive: boolean
//   id?: string // optional for persistence
//   autoHideSeconds?: number
// }
// interface notice{
    
//     _id: string
//     title: string,
//     message: string,
//     type: "info" | "warning" | "maintenance" | "critical",
//     isActive: boolean,
//     createdAt: string,
//     updatedAt: string,

// }
// export function NoticeBanner({}: NoticeBannerProps) {
//   const [isVisible, setIsVisible] = useState(false)
//   const [isMounted, setIsMounted] = useState(false)
//   const [notice,setNotice]=useState<notice>()

//   // Check localStorage (persist dismiss)
//   useEffect(() => {
//     async function getnotice(){
//         try {
//         const response=await axios.get(`${process.env.NEXT_PUBLIC_ADMIN_BACKEND!}api/v1/notice/active`)
//             setNotice(response.data)
//     } catch (error) {
//         console.log("Something went wrong please reload the website")
//     }

//     }
//     getnotice()
//     const dismissed = localStorage.getItem(`notice-dismissed-${notice?._id}`)
//     if (!dismissed && notice?.isActive) {
//       setIsVisible(true)
//     }
//     setIsMounted(true)
//   }, [notice?.isActive, notice?._id])


//   const handleDismiss = () => {
//     setIsVisible(false)
//     localStorage.setItem(`notice-dismissed-${notice?._id}`, 'true')
//   }

//   if (!isMounted || !isVisible) return null

//   const typeConfig = {
//     info: {
//       bg: 'bg-blue-600/10',
//       border: 'border-blue-500/40',
//       badge: 'bg-blue-500/20 text-blue-400',
//     },
//     warning: {
//       bg: 'bg-orange-600/10',
//       border: 'border-orange-500/40',
//       badge: 'bg-orange-500/20 text-orange-400',
//     },
//     maintenance: {
//       bg: 'bg-yellow-500/10',
//       border: 'border-yellow-400/40',
//       badge: 'bg-yellow-500/20 text-yellow-400',
//     },
//     critical: {
//       bg: 'bg-red-600/10',
//       border: 'border-red-500/40',
//       badge: 'bg-red-500/20 text-red-400',
//     },
//   }

//   const config = typeConfig[notice?.type!]

//   return (
//     <div className="sticky top-0 z-50 w-full">
//       <div
//         className={`
//           border-b ${config.border}
//           ${config.bg}
//           backdrop-blur-md
//           transition-all duration-300 ease-in-out
//           shadow-sm
//         `}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

//           {/* LEFT */}
//           <div className="flex items-center gap-4 min-w-0">

//             <span
//               className={`
//                 px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide
//                 ${config.badge}
//               `}
//             >
//               {notice?.type}
//             </span>

//             <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0">
//               <span className="font-semibold text-sm text-white">
//                 {notice?.title}
//               </span>
//               <span className="text-sm text-slate-300 truncate">
//                 {notice?.message}
//               </span>
//             </div>

//           </div>

//           {/* CLOSE BUTTON */}
//           <button
//             onClick={handleDismiss}
//             className="
//               p-2 rounded-md
//               text-slate-400 hover:text-white
//               hover:bg-white/10
//               transition
//               active:scale-95
//             "
//             aria-label="Dismiss notice"
//           >
//             <X size={18} />
//           </button>

//         </div>
//       </div>
//     </div>
//   )
// }
