/**
 * Motor do gingado do pinguim. Cada parte é uma função do tempo, com peso,
 * atraso e envelope — nada de keyframe. A chegada funde a caminhada com a
 * pose do logo em vez de cortar.
 *
 * Só toca no <g data-parte>, nunca no <g transform> interno (escala negativa
 * em Y do vetorizador). Unidades em px do espaço do logo.
 */
const TAU = Math.PI * 2;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn = (t: number) => t * t * t;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export type ParamsGingado = {
  ciclo: number; bob: number; incl: number; squash: number;
  atrasoCabeca: number; atrasoNad: number;
  pernaF: number; pe: number;
  /** ponta do braço de trás: multiplica o balanço do braço, com atraso extra */
  pontaGanho: number; pontaAtraso: number;
  nadFrenteBase: number; nadFrenteSw: number; nadTras: number;
  cabecaContra: number; cabecaNod: number;
};

/** Valores aprovados na etapa 2. */
export const PARAMS_PADRAO: ParamsGingado = {
  ciclo: 1.4, bob: 12, incl: 2.5, squash: 0.015,
  atrasoCabeca: 0.08, atrasoNad: 0.12,
  pernaF: 5, pe: 2,
  pontaGanho: 1.8, pontaAtraso: 0.06,
  nadFrenteBase: 18, nadFrenteSw: 4, nadTras: 3,
  cabecaContra: 0.6, cabecaNod: 1.3,
};

/** Curva vertical de um passo com gravidade: baque de 1,5px no contato,
 *  subida que desacelera até o ápice, queda que acelera. u ∈ [0,1). */
function passo(u: number) {
  if (u < 0.05) return 1.5 * Math.sin((u / 0.05) * Math.PI);
  if (u < 0.6) return -easeOut((u - 0.05) / 0.55);
  return -(1 - easeIn((u - 0.6) / 0.4));
}

const fase = (t: number, ciclo: number, atraso = 0) => ((((t - atraso * ciclo) / ciclo) % 1) + 1) % 1;

export function criarGingado(raiz: Element, params: Partial<ParamsGingado> = {}) {
  const p: ParamsGingado = { ...PARAMS_PADRAO, ...params };
  const el = (n: string) => raiz.querySelector<SVGGElement>(`[data-parte="${n}"]`);
  const corpo = el("corpo"), cabeca = el("cabeca"), pernaF = el("perna-frente"),
    ponta = el("nadadeira-tras-ponta"), pe = el("pe"), nadF = el("nadadeira-frente"), nadT = el("nadadeira-tras");
  if (!corpo || !cabeca || !pernaF || !ponta || !pe || !nadF || !nadT) {
    throw new Error("gingado: rig incompleto");
  }

  /** Pose em t (s). env: 1 = andando, 0 = pose do logo. x/y: deslocamento extra
   *  do corpo; rotExtra inclina o corpo; cabecaExtra vira a cabeça (negativo = olha para cima). */
  function aplicar(t: number, env: number, x = 0, y = 0, rotExtra = 0, cabecaExtra = 0) {
    const u = fase(t, p.ciclo);
    const u1 = (u * 2) % 1;
    const bob = passo(u1) * p.bob * env;
    const incl = -Math.sin(u * TAU) * p.incl * env + rotExtra;
    const sq = ((u1 < 0.05 || u1 > 0.9) ? p.squash : -p.squash * 0.4) * env;
    corpo!.style.transform =
      `translate(${x}px, ${y + bob}px) rotate(${incl}deg) scale(${1 + sq}, ${1 - sq})`;

    const uc = fase(t, p.ciclo, p.atrasoCabeca);
    const contra = Math.sin(uc * TAU) * p.incl * p.cabecaContra;
    const nod = Math.exp(-Math.pow(((uc * 2) % 1) / 0.12, 2)) * p.cabecaNod;
    cabeca!.style.transform = `rotate(${(contra + nod) * env + cabecaExtra}deg)`;

    const sw = Math.sin(u * TAU);
    pernaF!.style.transform = `rotate(${-sw * p.pernaF * env}deg)`;
    pe!.style.transform = `rotate(${Math.sin(u * TAU * 2) * p.pe * env}deg)`;

    const un = fase(t, p.ciclo, p.atrasoNad);
    const swn = Math.sin(un * TAU) * 1.15;
    nadF!.style.transform = `rotate(${lerp(0, p.nadFrenteBase, env) + swn * p.nadFrenteSw * env}deg)`;
    nadT!.style.transform = `rotate(${swn * p.nadTras * env}deg)`;
    // a ponta nasce no braço e chicoteia atrás dele: mais amplitude, mais atraso
    const up = fase(t, p.ciclo, p.atrasoNad + p.pontaAtraso);
    ponta!.style.transform = `rotate(${Math.sin(up * TAU) * 1.15 * p.nadTras * p.pontaGanho * env}deg)`;
  }

  /** Volta tudo à pose do logo. */
  function repouso() {
    for (const g of [corpo, cabeca, pernaF, ponta, pe, nadF, nadT]) g!.style.transform = "";
  }

  return { aplicar, repouso, params: p };
}

export type Gingado = ReturnType<typeof criarGingado>;
