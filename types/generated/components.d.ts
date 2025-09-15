import type { Schema, Struct } from '@strapi/strapi';

export interface SharedPrinzipAspekt extends Struct.ComponentSchema {
  collectionName: 'components_shared_prinzip_aspekts';
  info: {
    displayName: 'PrinzipAspekt';
  };
  attributes: {
    Beispiel: Schema.Attribute.Relation<'oneToOne', 'api::absatz.absatz'>;
    Formulierungsbeispiel: Schema.Attribute.Blocks;
    Leitfragen: Schema.Attribute.Blocks;
    Text: Schema.Attribute.Blocks & Schema.Attribute.Required;
    Titel: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedPrinzipKurzbezeichnung extends Struct.ComponentSchema {
  collectionName: 'components_shared_prinzip_kurzbezeichnungs';
  info: {
    description: '';
    displayName: 'PrinzipKurzbezeichnung';
    icon: 'quote';
  };
  attributes: {
    Name: Schema.Attribute.Enumeration<
      [
        'DigitaleKommunikation',
        'Wiederverwendung',
        'Datenschutz',
        'KlareRegelungen',
        'Automatisierung',
      ]
    >;
  };
}

export interface SharedPrinziperfuellung extends Struct.ComponentSchema {
  collectionName: 'components_shared_prinziperfuellungs';
  info: {
    description: '';
    displayName: 'PrinzipErf\u00FCllung';
    icon: 'bulletList';
  };
  attributes: {
    Erklaerung: Schema.Attribute.Blocks & Schema.Attribute.Required;
    Prinzip: Schema.Attribute.Relation<'oneToOne', 'api::prinzip.prinzip'>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedTag extends Struct.ComponentSchema {
  collectionName: 'components_shared_tags';
  info: {
    description: '';
    displayName: 'Tag';
    icon: 'hashtag';
  };
  attributes: {
    Tag: Schema.Attribute.Enumeration<['Tag1', 'Tag2']>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.prinzip-aspekt': SharedPrinzipAspekt;
      'shared.prinzip-kurzbezeichnung': SharedPrinzipKurzbezeichnung;
      'shared.prinziperfuellung': SharedPrinziperfuellung;
      'shared.seo': SharedSeo;
      'shared.tag': SharedTag;
    }
  }
}
