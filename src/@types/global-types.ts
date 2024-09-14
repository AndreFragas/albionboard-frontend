import {FormCardProps} from 'src/@prismafive/components/cards/form-card/types';

export interface IOptionsConfig {
  value: any;
  label: string;
}

export interface IViaCep {
  bairro: string;
  cep: string;
  complemento: string;
  ddd: string;
  gia: string;
  ibge: string;
  localidade: string;
  logradouro: string;
  siafi: string;
  uf: string;
  erro?: boolean;
}

export type IFormScreenTypes = 'create' | 'edit' | 'details' | 'pay' | 'receive';

export interface FormScreenProps {
  type: IFormScreenTypes;
  title?: string;
  id?: number | string;
  serverSideProps?: Record<string, any>;
  formCardProps?: FormCardProps;
}

export interface BaseModalProps {
  show: boolean;
  onClose: () => void;
}
