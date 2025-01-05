import React from "react";
import { Link } from "react-router-dom";

// Composant Navbar
const Navbar = () => (
  <header className="bg-[#F5F7FA] p-4 shadow-lg">
    <div className="flex justify-between items-center">
      <h1 className="text-[#1E3A5F] text-3xl font-bold">PrepGenius</h1>
      <nav className="space-x-6">
        <Link
          to="/login"
          className="text-[#1E3A5F] text-lg font-medium hover:text-[#3EB489] transition duration-300"
        >
          Connexion
        </Link>
        <Link
          to="/logup"
          className="px-4 py-2 bg-[#3EB489] text-white font-medium rounded-lg hover:bg-[#63B3ED] transition duration-300"
        >
          Inscription
        </Link>
      </nav>
    </div>
  </header>
);

// Composant Hero
const HeroSection = () => (
  <main className="text-center mb-12">
    <h2 className="text-5xl font-bold text-[#1E3A5F] mb-6">
      Créez des examens en quelques clics
    </h2>
    <p className="text-xl text-[#3EB489] mb-10 max-w-3xl mx-auto">
      Simplifiez la création d'examens avec notre plateforme, adaptée à vos
      besoins d'apprentissage. Générer, personnaliser et partager vos examens en
      toute simplicité.
    </p>
    <Link
      to="/create-exam"
      className="px-6 py-3 bg-[#1E3A5F] text-white font-semibold rounded-full text-lg hover:bg-[#63B3ED] transition duration-300"
    >
      Créer un examen maintenant
    </Link>
  </main>
);

// Composant Feature Card
const FeatureCard = ({ title, description, imgSrc }) => (
  <div className="flex items-center space-x-12 mb-12">
    <div className="max-w-lg">
      <h3 className="text-3xl font-bold mb-4">{title}</h3>
      <p className="text-lg mb-4">{description}</p>
    </div>
    <img src={imgSrc} alt={title} className="max-w-xs rounded-lg" />
  </div>
);

// Composant PricingCard
const PricingCard = ({ title, price, features, buttonText, popular }) => (
  <div
    className={`pricing-card ${
      popular ? "bg-gray-100 border-2 border-blue-600" : "bg-white"
    } p-8 text-center rounded-lg shadow-md w-1/3`}
  >
    <h3 className="text-xl font-semibold mb-5">{title}</h3>
    <p className="text-3xl font-bold mb-5">{price}</p>
    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
      {buttonText}
    </button>
    <ul className="mt-5 text-lg">
      {features.map((feature, index) => (
        <li key={index}>{feature}</li>
      ))}
    </ul>
  </div>
);

// Composant Testimonials
const Testimonial = ({ message, author }) => (
  <div className="testimonial mb-6">
    <p className="text-lg mb-4">{message}</p>
    <span className="block text-lg font-semibold">- {author}</span>
  </div>
);

// Composant HomePage
const HomePage = () => {
  return (
    <div className="bg-[#F5F7FA] min-h-screen overflow-y-auto max-h-96 margin-auto">
      <Navbar />
      <HeroSection />

      {/* Section des caractéristiques */}
      <section className="text-center mb-12">
        <h2 className="text-2xl font-semibold mb-5">
          Créez des examens adaptés
        </h2>
        <FeatureCard
          title="Quizzes adaptatifs"
          description="Les examens s'ajustent en fonction de vos performances, vous offrant une expérience d'apprentissage optimale."
          imgSrc="images/quiz.jpg"
        />
        <FeatureCard
          title="Flashcards de révision"
          description="Des cartes de révision générées automatiquement après chaque examen pour vous aider à mieux retenir les concepts."
          imgSrc="images/flashcards.jpg"
        />
        <FeatureCard
          title="Analyse des performances"
          description="Suivez vos progrès et identifiez les domaines à améliorer avec des graphiques détaillés."
          imgSrc="images/performance.jpg"
        />
      </section>

      {/* Section des prix */}
      <section className="flex justify-center space-x-12 mb-12">
        <PricingCard
          title="Essai gratuit"
          price="$0"
          features={["5 Générations d'examens", "Support par email"]}
          buttonText="Essayer"
        />
        <PricingCard
          title="Plan Standard"
          price="$5"
          features={[
            "30 Générations d'examens",
            "Support par email",
            "Accès à toutes les fonctionnalités",
          ]}
          buttonText="Souscrire"
          popular={true}
        />
        <PricingCard
          title="Plan Premium"
          price="$10"
          features={[
            "Examens illimités",
            "Support premium",
            "Accès à toutes les fonctionnalités",
          ]}
          buttonText="Souscrire"
        />
      </section>

      {/* Section des témoignages */}
      <section className="text-center mb-12">
        <h2 className="text-2xl font-semibold mb-5">
          Ce que disent nos utilisateurs
        </h2>
        <Testimonial
          message="PrepGenius m'a facilité la création d'examens pour mes élèves. Très simple à utiliser !"
          author="Marie, Professeur"
        />
        <Testimonial
          message="Cette plateforme m'a permis de mieux me préparer pour mes examens grâce à des quiz personnalisés."
          author="Luc, Étudiant"
        />
      </section>

      {/* Section FAQ */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-5 text-center">
          Questions fréquemment posées
        </h2>
        <div className="faq-item mb-5">
          <h3 className="text-xl font-semibold mb-3">
            Comment créer un examen ?
          </h3>
          <p className="text-lg">
            Il vous suffit de télécharger votre fichier (texte ou PDF) et notre
            outil générera un examen en fonction de votre contenu.
          </p>
        </div>
        <div className="faq-item mb-5">
          <h3 className="text-xl font-semibold mb-3">
            Puis-je personnaliser mes examens ?
          </h3>
          <p className="text-lg">
            Oui, vous pouvez définir le nombre de questions, le type de
            questions et la difficulté de chaque examen.
          </p>
        </div>
      </section>

      {/* Section Contact */}
      <section className="mb-12 text-center">
        <h2 className="text-2xl font-semibold mb-5">Contactez-nous</h2>
        <p className="text-lg mb-6">
          Si vous avez des questions ou besoin d'assistance, n'hésitez pas à
          nous contacter. Nous sommes là pour vous aider !
        </p>
        <form className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Votre nom"
            required
            className="mb-4 p-3 border rounded-md w-80"
          />
          <input
            type="email"
            placeholder="Votre email"
            required
            className="mb-4 p-3 border rounded-md w-80"
          />
          <textarea
            placeholder="Votre message"
            required
            className="mb-4 p-3 border rounded-md w-80 h-40"
          ></textarea>
          <button
            type="submit"
            className="bg-[#1E3A5F] text-white px-6 py-3 rounded-lg"
          >
            Envoyer le message
          </button>
        </form>
      </section>

      {/* Footer Section */}
      <footer className="bg-[#1E3A5F] text-white py-6">
        <div className="footer-content flex justify-between items-center flex-wrap">
          <span className="text-sm">
            &copy; Copyright 2024 PrepGenius. Tous droits réservés
          </span>
          <div className="footer-links flex space-x-5">
            <a href="#" className="text-sm">
              Confidentialité
            </a>
            <a href="#" className="text-sm">
              Comment ça marche
            </a>
            <a href="#" className="text-sm">
              Tarification
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
