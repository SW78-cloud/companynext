export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-navy-900 p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-navy-900" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/80 to-navy-700/30" />

                <div className="relative z-20 flex items-center text-lg font-medium">
                    <span className="text-orange-500 mr-2">Company</span>Next
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Transparency is the currency of trust. Company Next empowers professionals with the insights they need to make career-defining decisions confidentially.&rdquo;
                        </p>
                        <footer className="text-sm text-gray-400">Company Next Platform</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8 bg-gray-50 h-full flex items-center justify-center">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
                    {children}
                </div>
            </div>
        </div>
    );
}
