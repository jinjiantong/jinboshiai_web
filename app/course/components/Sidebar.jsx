const NavItem = ({ node, level, onItemClick, selectedItemId, expandedItems, theme }) => {
    const handleClick = () => {
      onItemClick(node);
    };
  
    const isExpanded = expandedItems.has(node.id);
    const isSelected = selectedItemId === node.id;
  
    const getStyles = () => {
      if (isSelected) {
        return {
          container: 'bg-slate-900 text-white rounded-xl mx-2 my-0.5',
          text: 'text-white font-medium',
          icon: 'text-white/70'
        };
      }
      return {
        container: 'hover:bg-slate-100 rounded-xl mx-2 my-0.5',
        text: 'text-slate-700',
        icon: 'text-slate-400'
      };
    };
  
    const styles = getStyles();
  
    return (
      <li className="transition-all duration-200">
        <button
          className={`w-full text-left py-2.5 px-4 flex items-center transition-all duration-200 ${styles.container}`}
          style={{ paddingLeft: `${level * 20 + 16}px` }}
          onClick={handleClick}
          data-item-id={node.id}
        >
          {node.children && node.children.length > 0 && (
            <svg
              className={`w-4 h-4 ${styles.icon} mr-2.5 transition-all duration-200 flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          <span className={`flex-1 text-sm ${styles.text}`} style={{ wordBreak: 'break-word' }}>
            {node.textElements && node.textElements.length > 0 ? (
              node.textElements.map((element, index) => 
                element.type === 'link' ? (
                  <span key={index} className="cursor-pointer">{element.text}</span>
                ) : (
                  <span key={index}>{element.text}</span>
                )
              )
            ) : (
              node.title.replace(/^\d+\.\s*/, '')
            )}
          </span>
        </button>
        {node.children && node.children.length > 0 && (
          <ul className={`transition-all duration-200 overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            {node.children.map(child => (
              <NavItem
                key={child.id}
                node={child}
                level={level + 1}
                onItemClick={onItemClick}
                selectedItemId={selectedItemId}
                expandedItems={expandedItems}
                theme={theme}
              />
            ))}
          </ul>
        )}
      </li>
    );
  };
  
  export default function Sidebar({ courseData, selectedItem, onItemClick, expandedItems, sidebarCollapsed, onToggleSidebar, theme, onToggleAll, areAllExpanded }) {
    return (
      <aside 
        className={`bg-white flex flex-col transition-all duration-500 ease-out ${
          sidebarCollapsed ? 'w-16' : 'w-72'
        }`}
      >
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent_50%)]"></div>
          <div className="relative z-10 text-center">
            <h1 className="text-white text-lg font-semibold tracking-tight">金博士AI实验室</h1>
            <p className="text-slate-400 text-xs mt-1">课程目录</p>
          </div>
        </div>
  
        {!sidebarCollapsed && (
          <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100">
            <button
              onClick={onToggleAll}
              className="w-full px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {areAllExpanded ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                )}
              </svg>
              {areAllExpanded ? '收起所有' : '展开所有'}
            </button>
          </div>
        )}
  
        <nav className="sidebar-nav flex-1 overflow-y-auto py-3 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <ul className="space-y-1">
            {courseData.map(node => (
              <NavItem 
                key={node.id} 
                node={node} 
                level={1} 
                onItemClick={onItemClick}
                selectedItemId={selectedItem?.id}
                expandedItems={expandedItems}
                theme={theme}
              />
            ))}
          </ul>
        </nav>
  
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/30">
            <button
              onClick={onToggleSidebar}
              className="w-full py-2 text-xs text-slate-500 hover:text-slate-700 transition-colors duration-200"
            >
              收起侧边栏
            </button>
          </div>
        )}
      </aside>
    );
  }