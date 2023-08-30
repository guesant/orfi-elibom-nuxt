import { format } from "date-fns";
import { encode } from "html-entities";
import QRCode from "qrcode";
import sharp from "sharp";
import { IGeradorCredencialFormData } from "../../domain/IGeradorCredencialFormData";
import { formatarCPF } from "../formatarCPF";

const getBlocosNome = (nomeCompleto: string) => {
  const blocosNome: string[] = [];

  for (const pedacoAtual of nomeCompleto.split(" ")) {
    const ultimoBloco = blocosNome[blocosNome.length - 1] ?? null;

    if (ultimoBloco === null) {
      blocosNome.push(pedacoAtual);
    } else {
      const ultimoBlocoAtualizado = `${ultimoBloco} ${pedacoAtual}`;

      if (ultimoBlocoAtualizado.length < 17) {
        blocosNome[blocosNome.length - 1] = ultimoBlocoAtualizado;
      } else {
        blocosNome.push(pedacoAtual);
      }
    }
  }

  return blocosNome;
};

const getLinhasNome = (nomeCompleto: string) => {
  const blocosNome = getBlocosNome(nomeCompleto);

  const alturaCaixa = blocosNome.length * 59;

  /*
  CaixaOrigemY = CaixaCentroY - (AlturaCaixa/2)
  LinhaOrigemY = CaixaOrigemY + (59 * Indice)
  LinhaOrigemY = CaixaCentroY - (AlturaCaixa/2) + (59 * Indice)
  */

  const caixaCentroY = 922.59;

  const caixaOrigemY = caixaCentroY - alturaCaixa / 2;

  return blocosNome.map((blocoNome, indice) => {
    const linhaOrigemY = caixaOrigemY + 59 * indice;

    return {
      x: 451,
      y: linhaOrigemY,
      text: blocoNome,
    };
  });
};

export const gerarConteudo = async (formData: IGeradorCredencialFormData) => {
  const enc = (d: string) => encode(d, { mode: "nonAsciiPrintableOnly", level: "xml" });

  const linhasNome = getLinhasNome(formData.nomeCompleto);

  const qrCodeImageDataURL = await QRCode.toDataURL(formData.matricula, { errorCorrectionLevel: "L" });

  const dados = {
    dataNascimento: format(new Date(formData.dataNascimento), "dd/MM/yyyy"),
    cpf: formatarCPF(formData.cpf),
    anoIngresso: formData.anoIngresso.toString(),
    previsaoConclusao: formData.previsaoConclusao.toString(),
    curso: formData.curso,
    campus: formData.campus,
    matricula: formData.matricula,
  };

  const images: { url: string; x: number; y: number; width: number; height: number }[] = [];

  images.push({
    url: qrCodeImageDataURL,
    x: 415,
    y: 289,
    width: 250,
    height: 250,
  });

  const arquivoFotoPerfilBuffer = Buffer.from(formData.arquivoFotoPerfilBase64, "base64");

  const rect = Buffer.from('<svg><rect x="0" y="0" width="341" height="341" rx="50%" ry="50%"/></svg>');

  const fotoPerfilBuffer = await sharp(arquivoFotoPerfilBuffer)
    .resize(341, 341)
    .composite([
      {
        input: rect,
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();

  const fotoPerfilDataUrl = `data:image/png;base64,${fotoPerfilBuffer.toString("base64")}`;

  images.push({
    url: fotoPerfilDataUrl,
    x: 55,
    y: 703,
    width: 341,
    height: 341,
  });

  const svg = `
  <svg width="1080" height="2184" viewBox="0 0 1080 2184" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g id="credencial">
    <g id="geral">
      <rect id="geral_bg" width="1080" height="2184" fill="white" />
      <g id="tabs">
        <g id="tab_5">
          <g id="Vector">
            <path d="M943 2084H1001V2088H943V2084Z" fill="#48454E" />
            <path d="M943 2099H1001V2103H943V2099Z" fill="#48454E" />
            <path d="M943 2114H1001V2118H943V2114Z" fill="#48454E" />
          </g>
        </g>
        <g id="tab_4">
          <path
            id="Vector 2"
            d="M779.5 2121.5H734.5C737.469 2116.97 738.92 2113.38 741 2104.5V2095C743.394 2086.39 746.303 2082.99 756.5 2081.5C765.69 2082.69 769.738 2084.9 772.5 2095V2104.5C773.04 2110.9 773.443 2114.51 779.5 2121.5Z"
            stroke="#48454E"
            stroke-width="4"
            stroke-linejoin="round"
          />
          <path
            id="Vector 3"
            d="M751 2074.5V2081.5H761.5V2074.5L756 2071.5L751 2074.5Z"
            stroke="#48454E"
            stroke-width="4"
            stroke-linejoin="round"
          />
          <path
            id="Vector 4"
            d="M749 2121C749.272 2127.92 750.864 2129.92 756 2130.5C761.09 2130.16 763.156 2128.62 764 2121"
            stroke="#48454E"
            stroke-width="4"
            stroke-linejoin="round"
          />
        </g>
        <g id="tab_3">
          <circle id="Ellipse 1" cx="540" cy="2086" r="14" stroke="#48454E" stroke-width="4" />
          <path
            id="Vector 1"
            d="M564.5 2129H516V2114.5C523.317 2109 528.682 2107.38 540 2106.5C549.689 2107.24 555.048 2108.94 564.5 2114.5V2129Z"
            stroke="#48454E"
            stroke-width="4"
          />
        </g>
        <g id="tab_2">
          <path
            id="Vector_2"
            d="M306 2098L306 2121M324 2098V2121M343 2098V2121M295 2130H353M297.5 2089.5H351V2087L324.5 2073L297.5 2087V2089.5Z"
            stroke="#48454E"
            stroke-width="4"
          />
        </g>
        <g id="tab_1">
          <rect id="Rectangle 5" x="20" y="2057" width="176" height="88" rx="44" fill="#EBDDFF" />
          <path
            id="Vector_3"
            d="M85 2129H82.5V2131.5H85V2129ZM131 2129V2131.5H133.5V2129H131ZM108 2073.5L109.61 2071.59L107.986 2070.22L106.373 2071.6L108 2073.5ZM134.89 2099.41C135.946 2100.3 137.523 2100.17 138.412 2099.11C139.302 2098.05 139.166 2096.48 138.11 2095.59L134.89 2099.41ZM78.373 2095.6C77.3247 2096.5 77.2033 2098.08 78.1019 2099.13C79.0004 2100.18 80.5787 2100.3 81.627 2099.4L78.373 2095.6ZM82.5 2093V2129H87.5V2093H82.5ZM85 2131.5H131V2126.5H85V2131.5ZM133.5 2129V2093H128.5V2129H133.5ZM106.39 2075.41L134.89 2099.41L138.11 2095.59L109.61 2071.59L106.39 2075.41ZM106.373 2071.6L78.373 2095.6L81.627 2099.4L109.627 2075.4L106.373 2071.6Z"
            fill="#200552"
          />
        </g>
      </g>
      <rect id="divider_2" y="2019" width="1080" height="1" fill="#BBBBBB" />
      <rect id="divider_1" y="647" width="1080" height="1" fill="#BBBBBB" />
      <g id="dados">
        <rect id="dados_bg" y="648" width="1080" height="1371" fill="#FAFAFA" />
        <g id="previsao_conclusao">
          <text
            id="previsao_conclusao_valor"
            fill="black"
            xml:space="preserve"
            style="white-space: pre"
            font-family="Roboto"
            font-size="39"
            font-weight="bold"
            letter-spacing="0em"
          >
            <tspan x="540" y="1729.33">${enc(dados.previsaoConclusao)}</tspan>
          </text>
          <text
            id="previsao_conclusao_label"
            fill="#777777"
            xml:space="preserve"
            style="white-space: pre"
            font-family="Roboto"
            font-size="33"
            font-weight="bold"
            letter-spacing="0em"
          >
            <tspan x="540" y="1677.78">Previs&#xe3;o conclus&#xe3;o</tspan>
          </text>
        </g>
        <g id="ano_ingresso">
          <text
            id="ano_ingresso_valor"
            fill="black"
            xml:space="preserve"
            style="white-space: pre"
            font-family="Roboto"
            font-size="39"
            font-weight="bold"
            letter-spacing="0em"
          >
            <tspan x="55" y="1729.33">${enc(dados.anoIngresso)}</tspan>
          </text>
          <text
            id="ano_ingresso_label"
            fill="#777777"
            xml:space="preserve"
            style="white-space: pre"
            font-family="Roboto"
            font-size="33"
            font-weight="bold"
            letter-spacing="0em"
          >
            <tspan x="55" y="1677.78">Ano ingresso</tspan>
          </text>
        </g>
        <g id="curso">
          <text
            id="curso_valor"
            fill="black"
            xml:space="preserve"
            style="white-space: pre"
            font-family="Roboto"
            font-size="39"
            font-weight="bold"
            letter-spacing="0em"
          >
            <tspan x="55" y="1566.33">${enc(dados.curso)}</tspan>
          </text>
          <text
            id="curso_label"
            fill="#777777"
            xml:space="preserve"
            style="white-space: pre"
            font-family="Roboto"
            font-size="33"
            font-weight="bold"
            letter-spacing="0em"
          >
            <tspan x="55" y="1514.78">Curso</tspan>
          </text>
        </g>
        <g id="campus">
          <text
            id="campus_valor"
            fill="black"
            xml:space="preserve"
            style="white-space: pre"
            font-family="Roboto"
            font-size="39"
            font-weight="bold"
            letter-spacing="0em"
          >
            <tspan x="540" y="1403.33">${enc(dados.campus)}</tspan>
          </text>
          <text
            id="campus_label"
            fill="#777777"
            xml:space="preserve"
            style="white-space: pre"
            font-family="Roboto"
            font-size="33"
            font-weight="bold"
            letter-spacing="0em"
          >
            <tspan x="540" y="1351.78">Campus</tspan>
          </text>
        </g>
        <g id="matricula_label">
          <text
            id="matricula_valor"
            fill="black"
            xml:space="preserve"
            style="white-space: pre"
            font-family="Roboto"
            font-size="39"
            font-weight="bold"
            letter-spacing="0em"
          >
            <tspan x="55" y="1403.33">${enc(dados.matricula)}</tspan>
          </text>
          <text
            id="matricula_label_2"
            fill="#777777"
            xml:space="preserve"
            style="white-space: pre"
            font-family="Roboto"
            font-size="33"
            font-weight="bold"
            letter-spacing="0em"
          >
            <tspan x="55" y="1351.78">Matr&#xed;cula</tspan>
          </text>
        </g>
        <g id="cpf">
          <text
            id="cpf_valor"
            fill="black"
            xml:space="preserve"
            style="white-space: pre"
            font-family="Roboto"
            font-size="39"
            font-weight="bold"
            letter-spacing="0em"
          >
            <tspan x="540" y="1240.33">${enc(dados.cpf)}</tspan>
          </text>
          <text
            id="cpf_label"
            fill="#777777"
            xml:space="preserve"
            style="white-space: pre"
            font-family="Roboto"
            font-size="33"
            font-weight="bold"
            letter-spacing="0em"
          >
            <tspan x="540" y="1188.78">CPF</tspan>
          </text>
        </g>
        <g id="data_nasc">
          <text
            id="data_nasc_valor"
            fill="black"
            xml:space="preserve"
            style="white-space: pre"
            font-family="Roboto"
            font-size="39"
            font-weight="bold"
            letter-spacing="0em"
          >
            <tspan x="55" y="1240.33">${enc(dados.dataNascimento)}</tspan>
          </text>
          <text
            id="data_nasc_label"
            fill="#777777"
            xml:space="preserve"
            style="white-space: pre"
            font-family="Roboto"
            font-size="33"
            font-weight="bold"
            letter-spacing="0em"
          >
            <tspan x="55" y="1188.78">Data nascimento</tspan>
          </text>
        </g>
      </g>
      <g id="btn-validacao">
        <g id="btn-validacao-bg" filter="url(#filter0_d_7_402)">
          <rect x="871" y="1810" width="154" height="154" rx="44" fill="#674FA3" />
        </g>
        <g id="btn-validacao-person-check" clip-path="url(#clip0_7_402)">
          <path
            id="Vector_4"
            d="M947 1907L944.85 1904.85C941.9 1901.9 941.925 1897.1 944.9 1894.2L947 1892.15C946.025 1892.05 945.3 1892 944.5 1892C937.825 1892 924.5 1895.35 924.5 1902V1907H947ZM944.5 1887C950.025 1887 954.5 1882.53 954.5 1877C954.5 1871.47 950.025 1867 944.5 1867C938.975 1867 934.5 1871.47 934.5 1877C934.5 1882.53 938.975 1887 944.5 1887Z"
            fill="white"
          />
          <path
            id="Vector_5"
            d="M957.45 1906.45C956.475 1907.42 954.875 1907.42 953.9 1906.45L948.725 1901.22C947.775 1900.25 947.775 1898.7 948.725 1897.75L948.75 1897.72C949.725 1896.75 951.3 1896.75 952.25 1897.72L955.675 1901.15L966.75 1890C967.725 1889.02 969.3 1889.02 970.275 1890L970.3 1890.02C971.25 1891 971.25 1892.55 970.3 1893.5L957.45 1906.45Z"
            fill="white"
          />
        </g>
      </g>
      <text
        id="nome"
        fill="black"
        xml:space="preserve"
        style="white-space: pre"
        font-family="Roboto"
        font-size="50"
        font-weight="bold"
        letter-spacing="0em"
      >
        ${linhasNome.map((linhaNome) => {
          return `<tspan x="${linhaNome.x}" y="${linhaNome.y}">${enc(linhaNome.text)}</tspan>`;
        })}
      </text>

      <g id="header">
        <rect id="header_bg" width="1080" height="180" fill="#579D55" />
        <text
          id="header_title"
          fill="white"
          xml:space="preserve"
          style="white-space: pre"
          font-family="Roboto"
          font-size="61"
          letter-spacing="0em"
        >
          <tspan x="165" y="115.85">ID IFRO</tspan>
        </text>
        <g id="header_icon_arrow_back" clip-path="url(#clip1_7_402)">
          <path
            id="Vector_6"
            d="M97.6666 87.1666H63.185L79.0233 71.3283L75 67.3333L52.3333 90L75 112.667L78.995 108.672L63.185 92.8333H97.6666V87.1666Z"
            fill="white"
          />
        </g>
      </g>
    </g>
  </g>
  <defs>
    <filter
      id="filter0_d_7_402"
      x="849"
      y="1796"
      width="198"
      height="198"
      filterUnits="userSpaceOnUse"
      color-interpolation-filters="sRGB"
    >
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
      <feMorphology radius="2" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_7_402" />
      <feOffset dy="8" />
      <feGaussianBlur stdDeviation="10" />
      <feComposite in2="hardAlpha" operator="out" />
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.28 0" />
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_7_402" />
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_7_402" result="shape" />
    </filter>
    <clipPath id="clip0_7_402">
      <rect width="60" height="60" fill="white" transform="translate(917 1857)" />
    </clipPath>
    <clipPath id="clip1_7_402">
      <rect width="68" height="68" fill="white" transform="translate(41 56)" />
    </clipPath>
  </defs>
</svg>`;

  return {
    svg,
    images,
  };
};
