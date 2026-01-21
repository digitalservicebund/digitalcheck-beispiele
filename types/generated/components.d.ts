import type { Schema, Struct } from '@strapi/strapi';

export interface PrinzipPrinzipAspektAnwendung extends Struct.ComponentSchema {
  collectionName: 'components_prinzip_prinzip_aspekt_anwendungen';
  info: {
    displayName: 'PrinzipAspektAnwendung';
    icon: 'check';
  };
  attributes: {
    Beispiel: Schema.Attribute.Relation<'oneToOne', 'api::absatz.absatz'>;
    Erklaerung: Schema.Attribute.Blocks;
    Formulierungsbeispiel: Schema.Attribute.Blocks;
    Titel: Schema.Attribute.String;
  };
}

export interface SharedPrinzipAspekt extends Struct.ComponentSchema {
  collectionName: 'components_shared_prinzip_aspekts';
  info: {
    displayName: 'PrinzipAspekt';
  };
  attributes: {
    Anwendung: Schema.Attribute.Component<
      'prinzip.prinzip-aspekt-anwendung',
      true
    >;
    Beispiel: Schema.Attribute.Relation<'oneToOne', 'api::absatz.absatz'>;
    Beschreibung: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'TBA'>;
    Formulierungsbeispiel: Schema.Attribute.Blocks;
    Kurzbezeichnung: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.DefaultTo<'TBD'>;
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
      'prinzip.prinzip-aspekt-anwendung': PrinzipPrinzipAspektAnwendung;
      'shared.prinzip-aspekt': SharedPrinzipAspekt;
      'shared.prinzip-kurzbezeichnung': SharedPrinzipKurzbezeichnung;
      'shared.prinziperfuellung': SharedPrinziperfuellung;
      'shared.seo': SharedSeo;
      'shared.tag': SharedTag;
    }
  }
}
