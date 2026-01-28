import React from 'react'
import Container from '../components/container/Container'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <Container>
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#eaf0ff] text-gray-800">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#5063A9] mb-4">PetVitals</h1>
        <p className="text-lg md:text-2xl max-w-2xl mx-auto text-gray-600">
          Your Pet’s Health, Simplified. Manage records, appointments, and more — all in one place.
        </p>
        <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
          <Link to="/signup" className="px-6 py-3 bg-[#5063A9] text-white rounded-md text-lg shadow hover:bg-[#405099] transition">Get Started</Link>
          <Link to="/login" className="px-6 py-3 border border-[#5063A9] text-[#5063A9] rounded-md text-lg hover:bg-[#f0f4ff] transition">Log In</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#5063A9] mb-10">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: "🩺", title: "Health Records", desc: "Store and access medical history anytime." },
              { icon: "🐶", title: "Pet Registration", desc: "Easily register your pets with full details." },
              { icon: "📅", title: "Appointments", desc: "Book and manage vet appointments." },
              { icon: "📊", title: "Vet Dashboard", desc: "Insights and tools for professionals." }
            ].map((feature, i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-6 text-center shadow hover:shadow-md transition">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-[#f8faff]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#5063A9] mb-6">Why Choose PetVitals?</h2>
          <p className="text-lg text-gray-700 mb-10">
            Built for pet owners and veterinary clinics alike, PetVitals offers a seamless experience to manage and monitor pet health.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="bg-white p-6 rounded-lg shadow w-full md:w-1/3">
              <h4 className="text-xl font-semibold text-[#5063A9] mb-2">Reliable</h4>
              <p>Secure and cloud-backed data storage.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow w-full md:w-1/3">
              <h4 className="text-xl font-semibold text-[#5063A9] mb-2">Easy to Use</h4>
              <p>Simple, intuitive interface for all users.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow w-full md:w-1/3">
              <h4 className="text-xl font-semibold text-[#5063A9] mb-2">Trusted by Vets</h4>
              <p>Built in collaboration with veterinary professionals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#5063A9] text-white py-16 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Start managing your pet’s health today</h2>
        <Link to="/signup" className="mt-4 inline-block px-8 py-3 bg-white text-[#5063A9] font-semibold rounded-md shadow hover:bg-gray-100 transition">
          Sign Up Free
        </Link>
      </section>
    </div>
    </Container>
  )
}

export default HomePage