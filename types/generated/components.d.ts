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
    displayName: 'Prinziperf\u00FCllung';
    icon: 'bulletList';
  };
  attributes: {
    KontextEnde: Schema.Attribute.Integer;
    KontextStart: Schema.Attribute.Integer;
    Prinzip: Schema.Attribute.Component<
      'shared.prinzip-kurzbezeichnung',
      false
    > &
      Schema.Attribute.Required;
    WarumGut: Schema.Attribute.Blocks & Schema.Attribute.Required;
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
      'shared.prinzip-kurzbezeichnung': SharedPrinzipKurzbezeichnung;
      'shared.prinziperfuellung': SharedPrinziperfuellung;
      'shared.seo': SharedSeo;
      'shared.tag': SharedTag;
    }
  }
}
