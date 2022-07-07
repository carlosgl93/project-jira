import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  console.log("middlware API ID llamado");

  const id = req.page.params?.id || "";

  const checkMongoIDRegExp = new RegExp("^[0-9a-fA-F]{24}$");

  //   si el regexp retorna false, se envia el response de error sino, se ejecuta el codigo de abajo
  //   esto se hace dado que mongoose no se puede usar dentro de next hasta nuevo aviso.
  if (!checkMongoIDRegExp.test(id)) {
    //   return res.status(400).json({ message: "Invalid id  " + id });
    return new Response(JSON.stringify({ message: "Invalid id  " + id }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return NextResponse.next();
}
