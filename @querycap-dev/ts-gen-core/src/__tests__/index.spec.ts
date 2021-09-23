import { Decl, Identifier, ModuleExport, ModuleImport, Type, Value } from "../";

const run = (name: string, input: any) => {
  it(`${name}
----------------------------------
${input}
----------------------------------
`, () => {
    console.log("run");
  });
};

describe("ts-gen-core", () => {
  run("#Identifier", Identifier.of("a"));
  run(
    "#Value",
    Decl.const(
      Identifier.of("A").generics(Type.of("TInner"), Type.of("TOuter")).typed(Type.string()).valueOf(Value.of("1")),
    ),
  );

  run(
    "#func",
    Decl.func(
      Identifier.of("A")
        .typed(Type.string())
        .generics(Type.of("T"))
        .paramsWith(
          Identifier.of("a").asOptional().typed(Identifier.of("string")).valueOf(Value.of("as")),
          Identifier.of("b").typed(Identifier.of("T")),
        )
        .valueOf(
          Value.bodyOf(Decl.returnOf(Identifier.of("otherFunc").paramsWith(Identifier.of("a"), Identifier.of("b")))),
        ),
    ),
  );

  run(
    "#Type",
    Decl.type(
      Identifier.of("A")
        .generics(Identifier.of("T"))
        .valueOf(Identifier.of("B").generics(Identifier.of("T"))),
    ),
  );

  run(
    "#Value",
    Decl.const(
      Identifier.of("A")
        .typed(Type.arrayOf(Type.string()))
        .valueOf(Value.arrayOf(Value.of("a"), Value.of("b"), Value.of("c"))),
    ),
  );

  run(
    "#Obj",
    Decl.let(
      Identifier.of("A")
        .typed(
          Type.objectOf(
            Identifier.of("a").typed(Type.string()),
            Identifier.of("b").typed(Type.string()),
            Identifier.of("c").typed(
              Type.objectOf(Identifier.of("a").valueOf(Value.of("a")), Identifier.of("b").valueOf(Value.of("b"))),
            ),
          ),
        )
        .valueOf(
          Value.objectOf(
            Identifier.of("a").valueOf(Value.of("a")),
            Identifier.of("b").valueOf(Value.of("b")),
            Identifier.of("c").valueOf(
              Value.objectOf(Identifier.of("a").valueOf(Value.of("a")), Identifier.of("b").valueOf(Value.of("b"))),
            ),
          ),
        ),
    ),
  );

  run(
    "#enum",
    Decl.enum(
      Identifier.of("A").valueOf(
        Type.enumOf(Identifier.of("a").valueOf(Value.of(1)), Identifier.of("b"), Identifier.of("c")),
      ),
    ),
  );

  run(
    "#interface",
    Decl.interface(
      Identifier.of("A")
        .generics(Identifier.of("T"))
        .extendsWith(Identifier.of("a"), Identifier.of("b"))
        .typed(
          Type.objectOf(
            Identifier.of("a").typed(Type.of(Identifier.of("T"))),
            Identifier.of("b").typed(Type.string()),
            Identifier.of("c").typed(Type.string()),
          ),
        ),
    ),
  );

  run("#import", ModuleImport.from("module"));

  run("#import all as", ModuleImport.from("module").allAs(Identifier.of("a")));

  run(
    "#import default as",
    ModuleImport.from("module").defaultAs(Identifier.of("b")).membersAs(Identifier.of("c").as("k"), Identifier.of("d")),
  );

  run("#export single", ModuleExport.decl(Decl.const(Identifier.of("d").valueOf(Value.of(1)))));

  run("#export multi", ModuleExport.of(Identifier.of("d"), Identifier.of("c")));

  run(
    "#class",
    Decl.class(
      Identifier.of("A")
        .generics(Identifier.of("T"))
        .extendsWith(Identifier.of("a"))
        .implementsWith(Identifier.of("a"), Identifier.of("b"))
        .valueOf(
          Value.memberOf(
            Identifier.of("a").typed(Type.string()).valueOf(Value.of("1")),
            Identifier.of("b").typed(Type.string()),
            Decl.method(Identifier.of("b").typed(Type.string())),
          ),
        ),
    ),
  );
});
