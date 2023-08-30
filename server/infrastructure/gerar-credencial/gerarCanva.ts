import { createCanvas, loadImage, registerFont } from "canvas";
import path from "node:path";
import { IGeradorCredencialFormData } from "../../domain/IGeradorCredencialFormData";
import { gerarConteudo } from "./gerarConteudo";

const VENDORS_PATH = path.join(path.dirname(new URL(import.meta.url).pathname), "../..", "public");

const robotoBold = path.join(VENDORS_PATH, "Roboto-Bold.ttf");
const robotoRegular = path.join(VENDORS_PATH, "Roboto-Regular.ttf");

export const gerarCanva = async (formData: IGeradorCredencialFormData) => {
  registerFont(robotoRegular, { family: "Roboto" });
  registerFont(robotoBold, { family: "Roboto", weight: "bold" });

  const canvas = createCanvas(1080, 2184);
  const ctx = canvas.getContext("2d");

  const conteudo = await gerarConteudo(formData);
  const svgUrl = `data:image/svg+xml;base64,${btoa(conteudo.svg)}`;

  const svgImg = await loadImage(svgUrl);
  ctx.drawImage(svgImg, 0, 0);

  for (const conteudoImage of conteudo.images) {
    const img = await loadImage(conteudoImage.url);
    ctx.drawImage(img, conteudoImage.x, conteudoImage.y, conteudoImage.width, conteudoImage.height);
  }

  return canvas;
};
