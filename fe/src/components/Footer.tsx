
const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-5 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} TodoFlow. All rights reserved.
        </div>
    </footer>
  )
}

export default Footer