import type { Struct, Schema } from '@strapi/strapi';

export interface SharedVisualisierung extends Struct.ComponentSchema {
  collectionName: 'components_shared_visualisierungs';
  info: {
    displayName: 'Visualisierung';
    icon: 'picture';
    description: '';
  };
  attributes: {
    Bild: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Beschreibung: Schema.Attribute.Blocks;
    VisualisierungsArt: Schema.Attribute.String;
    BildAlternativText: Schema.Attribute.String;
  };
}

export interface SharedTag extends Struct.ComponentSchema {
  collectionName: 'components_shared_tags';
  info: {
    displayName: 'Tag';
    icon: 'hashtag';
    description: '';
  };
  attributes: {
    Tag: Schema.Attribute.Enumeration<['Tag1', 'Tag2']>;
  };
}

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
    displayName: 'Digitalcheck';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    DigitaleKommunikation: Schema.Attribute.Component<
      'shared.prinziperfuellung',
      false
    > &
      Schema.Attribute.Required;
    Wiederverwendung: Schema.Attribute.Component<
      'shared.prinziperfuellung',
      false
    > &
      Schema.Attribute.Required;
    Datenschutz: Schema.Attribute.Component<'shared.prinziperfuellung', false> &
      Schema.Attribute.Required;
    KlareRegelungen: Schema.Attribute.Component<
      'shared.prinziperfuellung',
      false
    > &
      Schema.Attribute.Required;
    Automatisierung: Schema.Attribute.Component<
      'shared.prinziperfuellung',
      false
    > &
      Schema.Attribute.Required;
    Visualisierung: Schema.Attribute.Component<'shared.visualisierung', true>;
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
    NKRStellungnahmePrinzip: Schema.Attribute.Blocks;
    Paragraphen: Schema.Attribute.Component<'shared.paragraph', true>;
  };
}

export interface SharedParagraph extends Struct.ComponentSchema {
  collectionName: 'components_shared_paragraphs';
  info: {
    displayName: 'Paragraph';
    icon: 'book';
    description: '';
  };
  attributes: {
    Norm: Schema.Attribute.String & Schema.Attribute.Required;
    WarumWichtig: Schema.Attribute.Blocks & Schema.Attribute.Required;
    Tags: Schema.Attribute.Component<'shared.tag', true>;
    Regelungstext: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.visualisierung': SharedVisualisierung;
      'shared.tag': SharedTag;
      'shared.seo': SharedSeo;
      'shared.prinzipienerfuellung': SharedPrinzipienerfuellung;
      'shared.prinziperfuellung': SharedPrinziperfuellung;
      'shared.paragraph': SharedParagraph;
    }
  }
}
