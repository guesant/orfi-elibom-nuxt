import { sendStream } from "h3";
import { gerarCanva } from "../infrastructure/gerar-credencial/gerarCanva";

export default defineEventHandler(async (event) => {
  const formData = await readBody(event);

  const canvas = await gerarCanva(formData);

  const stream = canvas.createPNGStream();

  return sendStream(event, stream);
});
