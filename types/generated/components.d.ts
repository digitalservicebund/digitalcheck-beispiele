import type { Schema, Struct } from '@strapi/strapi';

export interface SharedAbsatz extends Struct.ComponentSchema {
  collectionName: 'components_shared_absatzs';
  info: {
    description: '';
    displayName: 'Absatz';
    icon: 'layer';
  };
  attributes: {
    PrinzipErfuellungen: Schema.Attribute.Component<
      'shared.prinziperfuellung',
      true
    >;
    Text: Schema.Attribute.Blocks & Schema.Attribute.Required;
  };
}

export interface SharedExampleAbsatz extends Struct.ComponentSchema {
  collectionName: 'components_shared_example_absatzs';
  info: {
    displayName: 'ExampleAbsatz';
    icon: 'handHeart';
  };
  attributes: {
    AbsatzNumber: Schema.Attribute.Integer & Schema.Attribute.Required;
    Paragraph: Schema.Attribute.Relation<
      'oneToOne',
      'api::paragraph.paragraph'
    >;
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
    Prinzip: Schema.Attribute.Relation<'oneToOne', 'api::prinzip.prinzip'>;
    WarumGut: Schema.Attribute.Blocks & Schema.Attribute.Required;
  };
}

export interface SharedPrinzipienAnwendung extends Struct.ComponentSchema {
  collectionName: 'components_shared_prinzipien_anwendungs';
  info: {
    displayName: 'PrinzipienAnwendung';
    icon: 'bulletList';
  };
  attributes: {
    Example: Schema.Attribute.Component<'shared.example-absatz', false>;
    Questions: Schema.Attribute.Blocks;
    Text: Schema.Attribute.Blocks & Schema.Attribute.Required;
    Title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    WordingExample: Schema.Attribute.Blocks;
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
      'shared.absatz': SharedAbsatz;
      'shared.example-absatz': SharedExampleAbsatz;
      'shared.prinzip-kurzbezeichnung': SharedPrinzipKurzbezeichnung;
      'shared.prinziperfuellung': SharedPrinziperfuellung;
      'shared.prinzipien-anwendung': SharedPrinzipienAnwendung;
      'shared.seo': SharedSeo;
      'shared.tag': SharedTag;
    }
  }
}
