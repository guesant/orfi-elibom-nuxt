export const formatarCPF = (cpfEntrada: string) => {
  const digitos = cpfEntrada.replace(/\D/g, "");

  return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9, 11)}`;
};
