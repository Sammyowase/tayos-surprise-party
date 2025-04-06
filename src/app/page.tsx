import RSVPForm from './components/RSVPForm';

export default function Home() {
  return (
    <main className="min-h-screen relative flex items-center justify-center">
      {/* Background gradient */}
      <div 
        className="fixed inset-0 bg-gradient-to-b from-gray-100 to-gray-300 z-0"
      />
      
      {/* Subtle pattern overlay */}
      <div className="fixed inset-0 z-0 opacity-10" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-4 py-8">
        <RSVPForm />
      </div>
    </main>
  );
}
