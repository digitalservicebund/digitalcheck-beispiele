import type { Schema, Struct } from '@strapi/strapi';

export interface SharedParagraph extends Struct.ComponentSchema {
  collectionName: 'components_shared_paragraphs';
  info: {
    description: '';
    displayName: 'Paragraph';
    icon: 'book';
  };
  attributes: {
    Norm: Schema.Attribute.String & Schema.Attribute.Required;
    Regelungstext: Schema.Attribute.RichText & Schema.Attribute.Required;
    Tags: Schema.Attribute.Component<'shared.tag', true>;
    WarumWichtig: Schema.Attribute.Blocks & Schema.Attribute.Required;
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
    EinschaetzungReferat: Schema.Attribute.Enumeration<
      ['Ja', 'Nein', 'Teilweise', 'Nicht relevant']
    > &
      Schema.Attribute.Required;
    Paragraphen: Schema.Attribute.Component<'shared.paragraph', true>;
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

export interface SharedVisualisierung extends Struct.ComponentSchema {
  collectionName: 'components_shared_visualisierungs';
  info: {
    description: '';
    displayName: 'Visualisierung';
    icon: 'picture';
  };
  attributes: {
    Beschreibung: Schema.Attribute.Blocks;
    Bild: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    VisualisierungsArt: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.paragraph': SharedParagraph;
      'shared.prinziperfuellung': SharedPrinziperfuellung;
      'shared.seo': SharedSeo;
      'shared.tag': SharedTag;
      'shared.visualisierung': SharedVisualisierung;
    }
  }
}
