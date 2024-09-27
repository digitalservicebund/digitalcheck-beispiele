import type { Struct, Schema } from '@strapi/strapi';

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    name: 'Seo';
    icon: 'allergies';
    displayName: 'Seo';
    description: '';
  };
  attributes: {
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedPrinzipienerfuellung extends Struct.ComponentSchema {
  collectionName: 'components_shared_prinzipienerfuellungs';
  info: {
    displayName: 'Prinzipienerf\u00FCllung';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    DigitaleKommunikation: Schema.Attribute.Component<
      'shared.prinziperfuellung',
      false
    >;
    Wiederverwendung: Schema.Attribute.Component<
      'shared.prinziperfuellung',
      false
    >;
    Datenschutz: Schema.Attribute.Component<'shared.prinziperfuellung', false>;
    KlareRegelungen: Schema.Attribute.Component<
      'shared.prinziperfuellung',
      false
    >;
    Automatisierung: Schema.Attribute.Component<
      'shared.prinziperfuellung',
      false
    >;
  };
}

export interface SharedPrinziperfuellung extends Struct.ComponentSchema {
  collectionName: 'components_shared_prinziperfuellungs';
  info: {
    displayName: 'Prinziperf\u00FCllung';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    EinschaetzungReferat: Schema.Attribute.Enumeration<
      ['Ja', 'Nein', 'Teilweise', 'Nicht relevant']
    > &
      Schema.Attribute.Required;
    Paragraphen: Schema.Attribute.Blocks;
    NKRStellungnahme: Schema.Attribute.Blocks;
    BegruendungDS: Schema.Attribute.Blocks;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.seo': SharedSeo;
      'shared.prinzipienerfuellung': SharedPrinzipienerfuellung;
      'shared.prinziperfuellung': SharedPrinziperfuellung;
    }
  }
}
