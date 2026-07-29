export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 py-12 text-slate-600 text-sm mt-auto">
            <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                {/* Brand */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
                            AI
                        </div>
                        <span className="text-lg font-bold text-slate-900">InterviewAI</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        The intelligent mock interview platform designed for software engineers and managers.
                    </p>
                </div>

                {/* Product Links */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Product</h4>
                    <ul className="space-y-2 text-xs">
                        <li><a href="/#features" className="hover:text-indigo-600 transition-colors">Voice AI Coach</a></li>
                        <li><a href="/#features" className="hover:text-indigo-600 transition-colors">Resume Parser</a></li>
                        <li><a href="/#features" className="hover:text-indigo-600 transition-colors">Rubric Analytics</a></li>
                    </ul>
                </div>

                {/* Resources Links */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Resources</h4>
                    <ul className="space-y-2 text-xs">
                        <li><a href="/#demo" className="hover:text-indigo-600 transition-colors">Interactive Demo</a></li>
                        <li><a href="/#testimonials" className="hover:text-indigo-600 transition-colors">Success Stories</a></li>
                        <li><a href="/#faq" className="hover:text-indigo-600 transition-colors">FAQ</a></li>
                    </ul>
                </div>

                {/* Status */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">System Status</h4>
                    <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg inline-block">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                        All AI Models Operational
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="mx-auto max-w-7xl px-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
                <p>© {new Date().getFullYear()} InterviewAI Inc. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-slate-600 transition-colors">Contact Support</a>
                </div>
            </div>
        </footer>
    )
}
