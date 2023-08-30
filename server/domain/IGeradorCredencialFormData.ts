import { z } from "zod";

export interface IGeradorCredencialFormData {
  nomeCompleto: string;
  dataNascimento: Date | number | string;
  cpf: string;
  anoIngresso: number;
  previsaoConclusao: number;
  curso: string;
  campus: string;
  matricula: string;

  arquivoFotoPerfilBase64: string;
}

export const ZodGeradorCredencialFormData = z.object({
  nomeCompleto: z.string(),
  dataNascimento: z.string().datetime(),
  cpf: z.string(),
  anoIngresso: z.number().int(),
  previsaoConclusao: z.number().int(),
  curso: z.string(),
  campus: z.string(),
  matricula: z.string(),
  arquivoFotoPerfilBase64: z.string(),
});
