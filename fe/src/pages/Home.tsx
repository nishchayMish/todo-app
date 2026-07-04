import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
            Organize Your Tasks
            <span className="block text-slate-500">
              Without The Chaos
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-600">
            A simple, fast, and beautiful todo app to help you stay
            productive and keep track of everything that matters.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <button className="px-7 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition">
              Get Started
            </button>

            <button className="px-7 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-100 transition">
              Learn More
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default Home;