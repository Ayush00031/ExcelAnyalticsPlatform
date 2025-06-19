const Sidebar = () => {
  return (
    <aside className="fixed top-23 left-0 h-[calc(90vh-4rem)] w-64 bg-gradient-to-r from-emerald-300 to-emerald-500 text-white shadow-md rounded-tr-3xl rounded-br-3xl z-40 transition-all duration-300 ease-in-out">
      <nav className="flex flex-col gap-4 p-6">
        <a
          href="/dashboard"
          className="hover:bg-emerald-700 px-4 py-2 rounded-md"
        >
          Dashboard
        </a>
        <a href="/upload" className="hover:bg-emerald-700 px-4 py-2 rounded-md">
          Upload File
        </a>
        <a href="/charts" className="hover:bg-emerald-700 px-4 py-2 rounded-md">
          Charts
        </a>
        <a
          href="/history"
          className="hover:bg-emerald-700 px-4 py-2 rounded-md"
        >
          History
        </a>
        <a href="/admin" className="hover:bg-emerald-700 px-4 py-2 rounded-md">
          Admin Panel
        </a>
      </nav>
    </aside>
  );
};
export default Sidebar;
