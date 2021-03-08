# melhorzao

Esse read-me serve tanto pro front quanto pro back.

## TO-DO FIXES:

Coisas que eu sei que estão "erradas" e preciso ficar de olho.

### Front:

1. Número de coleções na lista está setado manualmente por causa do render client-side do papel de parede animado. 100% funcional e eficiênte, mas tem que lembrar de ficar mudando sempre que adicionar ou tirar uma coleção.

### Back:

1. Imagens de livre acesso no bucket da Amazon, pode ser exploitado por alguem mau intencionado e gerar custos.
2. Incerto se o rate-limit é por usuário ou para a api inteira
