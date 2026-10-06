import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { whatsappLink } from '../../shared/studio';

interface Faq {
  q: string;
  a: string;
}

@Component({
  selector: 'app-cuidados',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cuidados.component.html',
  styleUrl: './cuidados.component.css'
})
export class CuidadosComponent {
  readonly whatsapp = whatsappLink('Hola! Tengo una consulta sobre un tatuaje.');

  readonly before = [
    'Dormí bien la noche anterior y vení habiendo comido.',
    'Evitá el alcohol las 24 h previas: aumenta el sangrado y complica el trabajo.',
    'Si tomás medicación, tenés alergias o alguna condición de la piel, avisame antes.',
    'Traé ropa cómoda que deje accesible la zona a tatuar.',
    'Si la zona está lastimada, quemada por el sol o irritada, conviene reprogramar.'
  ];

  readonly after = [
    'Dejá el film o apósito el tiempo que te indique al terminar la sesión.',
    'Lavá el tatuaje con agua tibia y jabón neutro, con las manos limpias, 2 o 3 veces por día.',
    'Secá dando toquecitos con papel descartable, sin frotar.',
    'Aplicá una capa fina de la crema que te recomiende: poca cantidad, que la piel respire.',
    'No rasques ni arranques las costritas: se caen solas.',
    'Evitá sol directo, pileta, mar y sauna durante 2 a 3 semanas.',
    'Usá ropa suelta sobre la zona los primeros días.',
    'Una vez cicatrizado, usá protector solar para que el tatuaje dure mejor.'
  ];

  readonly faqs: Faq[] = [
    {
      q: '¿Cómo funciona la solicitud de turno?',
      a: 'Elegís un horario en la sección Turnos y me contás tu idea. El horario queda reservado para vos y te escribo para coordinar diseño, presupuesto y seña. El turno queda confirmado cuando cerramos esos detalles.'
    },
    {
      q: '¿Cómo es lo de la seña?',
      a: 'Una vez que definimos el diseño y el presupuesto, te paso los datos para la seña. Con la seña el turno queda confirmado y se descuenta del total.'
    },
    {
      q: '¿Cuánto cuesta un tatuaje?',
      a: 'Depende del tamaño, la zona y el nivel de detalle. Cada presupuesto es personalizado: contame tu idea y te paso un valor.'
    },
    {
      q: '¿Puedo llevar mi propio diseño o una referencia?',
      a: 'Sí. Las referencias sirven mucho para entender lo que buscás. A partir de eso armo una propuesta propia, adaptada a tu cuerpo y a mi estilo.'
    },
    {
      q: '¿Cómo cancelo o cambio mi turno?',
      a: 'En el mail que te llega al enviar la solicitud tenés el link "Gestionar mi turno". Desde ahí podés cancelar o cambiar el horario hasta 48 h antes. Después de ese plazo, escribime por WhatsApp.'
    },
    {
      q: '¿Hay edad mínima?',
      a: 'Tatúo solo a mayores de 18 años, y te voy a pedir el DNI el día de la sesión.'
    },
    {
      q: '¿Duele?',
      a: 'Depende de la zona y de cada persona. Las zonas con hueso cerca (costillas, tobillos, manos) suelen molestar más. Durante la sesión hacemos las pausas que necesites.'
    },
    {
      q: '¿Qué pasa si después de cicatrizar algo no quedó parejo?',
      a: 'Escribime cuando esté bien cicatrizado (alrededor de un mes) y lo vemos juntos.'
    }
  ];
}
