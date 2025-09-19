import Link from 'next/link';
import { sidebarLinks } from './menus';

export default function Sidebar() {
  return (
    <div className="fixed left-0 top-0 z-10 hidden h-screen w-1/6 flex-shrink-0 border-r border-purple-900/30 bg-black xl:block">
      <div className="flex h-full flex-col border-r border-purple-900/30 bg-black/90 backdrop-blur-md">
        <div className="px-3 py-4">
          <Link href="/" className="group mb-4 flex items-center transition-all duration-300">
            {/* Logo */}
            <span className="ml-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-xl font-bold text-transparent">
             Niigelog.ai
            </span>
          </Link>
        </div>
        
        <div className="flex-grow overflow-y-auto px-3">
          {sidebarLinks.map((section) => (
            <div key={section.title} className="space-y-2">
              <div className="mb-2 flex items-center px-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                  {section.title}
                </p>
              </div>
              <div className="space-y-1">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-x-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 text-purple-300 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/5 hover:text-white"
                  >
                    {link.icon}
                    <span>{link.label}</span>
                    {(
                      <span className="ml-2 inline-flex items-center rounded bg-red-500/20 px-1.5 py-0.5 text-xs font-medium text-red-500">
                        Hot
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* 底部用户区域 */}
        <div className="mt-auto border-t border-purple-900/30 px-3 pb-4 pt-3">
          {/* 升级按钮和用户信息 */}
        </div>
      </div>
    </div>
  );
}