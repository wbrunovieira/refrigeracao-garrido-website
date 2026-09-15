import { NextResponse } from "next/server";
import { contarEventos } from "@/lib/revisao";

/**
 * "Mudou alguma coisa?" em uma operação de Blob.
 *
 * Serve para o painel acender o aviso de novidade sem baixar o registro inteiro e, principalmente,
 * sem mexer na tela de quem está lendo ou escrevendo. Quem decide atualizar é a pessoa, clicando.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await contarEventos());
  } catch (e) {
    console.error("[revisao] falha ao contar", e);
    // Falhar aqui não pode atrapalhar quem está usando a página: devolve "nada novo".
    return NextResponse.json({ total: null, ultimo: null });
  }
}
