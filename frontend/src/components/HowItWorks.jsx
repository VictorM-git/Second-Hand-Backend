import Chip from './Chip.jsx';

const steps = [
  { tag: 'Primero', variant: 'green', title: 'Publica', text: 'Una foto, la categoría y en qué estado está. Solo toma un minuto ponerlo a disposición de la comunidad.' },
  { tag: 'Después', variant: 'yellow', title: 'Recibe solicitudes', text: 'Quien lo necesite te escribe a través de la plataforma explicando para qué lo usará. Tú decides a quién dárselo.' },
  { tag: 'Al final', variant: 'grey', title: 'Se encuentran', text: 'Aceptas la solicitud, coordinan un lugar público seguro y realizas la entrega. Sin intercambios monetarios.' },
];

// Explicación del flujo en 3 pasos. Apilado en móvil, 3 columnas desde tablet.
export default function HowItWorks() {
  return (
    <section className="sh-how" aria-labelledby="how-title">
      <div className="container">
        <h2 id="how-title" className="sh-section-title">Cómo funciona</h2>
        <div className="row g-4">
          {steps.map((s) => (
            <div className="col-12 col-md-4 sh-how__step" key={s.title}>
              <Chip variant={s.variant}>{s.tag}</Chip>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
