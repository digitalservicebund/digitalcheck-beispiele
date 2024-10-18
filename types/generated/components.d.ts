import type { Struct, Schema } from '@strapi/strapi';

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
    NKRStellungnahme: Schema.Attribute.Blocks;
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
    ErlaeuterungDS: Schema.Attribute.Blocks;
    Tags: Schema.Attribute.Component<'shared.tag', true>;
    Text: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.tag': SharedTag;
      'shared.seo': SharedSeo;
      'shared.prinzipienerfuellung': SharedPrinzipienerfuellung;
      'shared.prinziperfuellung': SharedPrinziperfuellung;
      'shared.paragraph': SharedParagraph;
    }
  }
}
