

interface Token {
	type: string,
	value: string
}

const Regex = {
	whitespace: /\s/,
	numbers: /[0-9_\.\+\-]/,
	labels: /[a-z0-9_]/i,
	fullNumber: /(\+|\-)?(([0-9_]*\.?[0-9_]*)|[0-9_]*)/
}

interface Label {
	name: string,
	maxParams: number,
	codeGeneration: (name: string, ...params: any[]) => string
};

interface Constant {
	name: string,
	value: string
}

const AllowedLabels: Label[] = [
	{
		name: 'acos',
		maxParams: 1,
		codeGeneration: (name, ...params: any[]) => {
			return `Math.acos(${params.flat().flat().join(',')})`;
		}
	},
	{
		name: 'asin',
		maxParams: 1,
		codeGeneration: (name, ...params: any[]) => {
			return `Math.asin(${params.flat().join(',')})`;
		}
	},
	{
		name: 'atan',
		maxParams: 1,
		codeGeneration: (name, ...params: any[]) => {
			return `Math.atan(${params.flat().join(',')})`;
		}
	},
	{
		name: 'sin',
		maxParams: 1,
		codeGeneration: (name, ...params: any[]) => {
			return `Math.sin(${params.flat().join(',')})`;
		}
	},
	{
		name: 'cos',
		maxParams: 1,
		codeGeneration: (name, ...params: any[]) => {
			return `Math.cos(${params.flat().join(',')})`;
		}
	},
	{
		name: 'tan',
		maxParams: 1,
		codeGeneration: (name, ...params: any[]) => {
			return `Math.tan(${params.flat().join(',')})`;
		}
	},
	{
		name: 'cbrt',
		maxParams: 1,
		codeGeneration: (name, ...params: any[]) => {
			return `Math.cbrt(${params.flat().join(',')})`;
		}
	},
	{
		name: 'log',
		maxParams: 1,
		codeGeneration: (name, ...params: any[]) => {
			return `Math.log(${params.flat().join(',')})`;
		}
	},
	{
		name: 'log10',
		maxParams: 1,
		codeGeneration: (name, ...params: any[]) => {
			return `Math.log10(${params.flat().join(',')})`;
		}
	},
	
	{
		name: 'log2',
		maxParams: 1,
		codeGeneration: (name, ...params: any[]) => {
			return `Math.log2(${params.flat().join(',')})`;
		}
	},
	{
		name: 'rand',
		maxParams: 0,
		codeGeneration: (name, ...params: any[]) => {
			return `Math.random()`;
		}
	},
	{
		name: 'sqrt',
		maxParams: 1,
		codeGeneration: (name, ...params: any[]) => {
			return `Math.sqrt(${params.flat().join(',')})`;
		}
	},
	{
		name: 'floor',
		maxParams: 1,
		codeGeneration: (name, ...params: any[]) => {
			return `Math.floor(${params.flat().join(',')})`;
		}
	},
	{
		name: 'add',
		maxParams: 2,
		codeGeneration: (name, ...params: any[]) => {
			return `(${params.flat()[0]}) + (${params.flat()[1]})`;
		}
	},
	{
		name: 'subtract',
		maxParams: 2,
		codeGeneration: (name, ...params: any[]) => {
			return `(${params.flat()[0]}) - (${params.flat()[1]})`;
		}
	},
	{
		name: 'multiply',
		maxParams: 2,
		codeGeneration: (name, ...params: any[]) => {
			return `(${params.flat()[0]}) * (${params.flat()[1]})`;
		}
	},
	{
		name: 'pow',
		maxParams: 2,
		codeGeneration: (name, ...params: any[]) => {
			return `(${params.flat()[0]}) ** (${params.flat()[1]})`;
		}
	},
	{
		name: 'divide',
		maxParams: 2,
		codeGeneration: (name, ...params: any[]) => {
			return `(${params.flat()[0]}) / (${params.flat()[1]})`;
		}
	},
	{
		name: 'func',
		maxParams: 2,
		codeGeneration: (name, ...params: any[]) => {
			return `function ${params.flat()[0]}(x) {
				return ${params.flat()[1]}
			};`;
		}
	}
]

const Constants: Constant[] = [
	{
		name: 'PI',
		value: 'Math.PI'
	},
	{
		name: 'E',
		value: 'Math.E'
	},
	{
		name: 'LN10',
		value: 'Math.LN10'
	},
	{
		name: 'LN2',
		value: 'Math.LN2'
	},
	{
		name: 'LOG2E',
		value: 'Math.LOG2E'
	},
	{
		name: 'LOG10E',
		value: 'Math.LOG10E'
	},
	{
		name: 'SQRT1_2',
		value: 'Math.SQRT1_2'
	},
	{
		name: 'SQRT2',
		value: 'Math.SQRT2'
	},
	{
		name: 'infinity',
		value: 'Infinity'
	},
	{
		name: 'phi',
		value: '(1 + Math.sqrt(5))'
	},
	{
		name: 'tau',
		value: '2 * Math.PI'
	},
	{
		name: 'x',
		value: 'x'
	}
];

let createdFunctions: string[] = [];
const createdFunctionObject: Label = {
	name: 'createdfunction',
	maxParams: 1,
	codeGeneration: (name, ...params) => {
		return `${name}(${params[0]})`;
	},
}

interface TopNode {
	type: string
}

interface LiteralNode extends TopNode {
	value: string
};

interface ExpressionNode extends TopNode {
	name: string,
	params: (LiteralNode | ExpressionNode)[]
}

interface ProgramNode extends TopNode {
	body: (LiteralNode | ExpressionNode)[]
}

function lexer(input: string) {

	// Track the position in the input (Cursor-like)
	let current = 0;

	let tokens: Token[] = [];

	while (current < input.length) {

		let char = input[current];

		if (char === '(' || char === ')') {
			tokens.push({
				type: 'parenthesis',
				value: char
			});
			current++;
			continue;
		}

		if (char === '{' || char === '}') {
			tokens.push({
				type: 'block',
				value: char
			});
			current++;
			continue;
		}

		if (Regex.whitespace.test(char)) {
			current++;
			continue;
		}

		if (Regex.numbers.test(char) && char !== '_') {
			
			let value = "";

			while (Regex.numbers.test(char)) {
				value += char;
				char = input[++current];
			}

			if (value.endsWith('_')) throw new SyntaxError('Numbers may not end with _');

			value = [ ...value ].filter((v) => v !== '_').join('');

			if (!Regex.fullNumber.test(value)) {
				throw new Error('Numbers may only be pos/neg integers or floats');
			}

			if (value.startsWith('+.') || value.startsWith('-.') || value.startsWith('.')) {
				const [sign, digits] = value.split('.');
				value = `${sign}0.${digits}`;
			}

			tokens.push({
				type: 'number',
				value
			});

			continue;
		}

		if (Regex.labels.test(char) && char !== '_') {

			let value = '';

			while (Regex.labels.test(char)) {
				value += char;
				char = input[++current];
			}

			if (value.endsWith('_')) throw new SyntaxError('Labels may not end with _');

			if (value === 'func') {
				let temp = current;

				let functionName = "";

				char = input[++current];

				while (Regex.labels.test(char)) {
					functionName += char;
					char = input[++current];
				}

				createdFunctions.push(functionName);

				tokens.push({
					type: 'label',
					value
				});
				tokens.push({
					type: 'parenthesis',
					value: '('
				});
				tokens.push({
					type: 'createdFunction',
					value: functionName
				});

				continue;
			}

			if (createdFunctions.includes(value)) {
				tokens.push({
					type: 'label',
					value
				});
				continue;
			}

			if (AllowedLabels.filter((v) => v.name === value).length === 0 && Constants.filter((v) => v.name === value).length === 0) throw new SyntaxError('Unknown label/constant ' + value);

			tokens.push({
				type: 'label',
				value
			});
			
			continue;
		}

		throw new SyntaxError('Unknown character: ' + char + ' at ' + current);
	}

	return tokens;
}

function parser(tokens: Token[]): ProgramNode {

	// Cursor
	let current = 0;

	// Recursive walk function
	function walk(): LiteralNode | ExpressionNode {

		let token = tokens[current];

		if (token.type === 'number') {
			current++;

			return {
				type: 'NumberLiteral',
				value: token.value
			};
		}

		if (token.type === 'label' && tokens[++current].value === '(') {

			let node: ExpressionNode = {
				type: 'CallExpression',
				name: token.value,
				params: []
			};

			const filteredLabels = AllowedLabels.filter((v) => v.name === node.name);

			if (filteredLabels.length < 1 && !createdFunctions.includes(node.name)) throw new SyntaxError('Unknown label ' + node.name);
			const { maxParams } = filteredLabels.length < 1 ? createdFunctionObject : filteredLabels[0];

			token = tokens[++current];

			while (token.value !== ')') {
				node.params.push(walk());
				token = tokens[current];
			}

			if (node.params.length !== maxParams) throw new SyntaxError('Label ' + node.name + ' may have ' + maxParams + ' parameter');

			current++;

			return node;
		}

		if (token.type === 'label') {

			const constantsFiltered = Constants.filter((v) => v.name === token.value);
			if (constantsFiltered.length < 1) throw new SyntaxError('Unknown constant ' + token.value);
			const constant = constantsFiltered[0];

			return {
				type: 'ConstantLiteral',
				value: constant.value
			};
		}

		if (token.type === 'createdFunction') {
			current++;
			return {
				type: 'CreatedFunctionLiteral',
				value: token.value
			};
		}

		throw new TypeError('Unknown token ' + token.type + ' with value ' + token.value);
	}

	let ast: ProgramNode = {
		type: 'Program',
		body: []
	};

	while (current < tokens.length) {
		ast.body.push(walk());
	}

	return ast;
}

function traverser(ast: ProgramNode, visitor: any) {

	function traverseArray(array, parent) {
		array.forEach(e => {
			traverseNode(e, parent);
		});
	}


	function traverseNode(node, parent) {

		let methods = visitor[node.type];

		if (methods && methods.enter) {
			methods.enter(node, parent);
		}

		switch(node.type) {
			case 'Program':
				traverseArray(node.body, node);

				break;
			case 'CallExpression':
				traverseArray(node.params, node);

			case 'NumberLiteral':
			case 'ConstantLiteral':
			case 'CreatedFunctionLiteral':
				break;

			default:
				throw new TypeError('Unknown type ' + node.type + ' with value ' + node.value);
		}

		if (methods && methods.exit) {
			methods.exit(node, parent);
		}
	}

	traverseNode(ast, null);
}

function transformer(ast) {

	let newAst = {
		type: 'Program',
		body: []
	};

	ast._context = newAst.body;

	traverser(ast, {
		NumberLiteral: {
			enter(node, parent) {
				parent._context.push({
					type: 'NumberLiteral',
					value: node.value
				});
			},
		},
		ConstantLiteral: {
			enter(node, parent) {
				parent._context.push({
					type: 'ConstantLiteral',
					value: node.value
				});
			},
		},
		CreatedFunctionLiteral: {
			enter(node, parent) {
				parent._context.push({
					type: 'CreatedFunctionLiteral',
					value: node.value
				});
			},
		},
		CallExpression: {
			enter(node, parent) {
				let expression: any = {
					type: 'CallExpression',
					callee: {
						type: 'Identifier',
						name: node.name
					},
					arguments: []
				};

				node._context = expression.arguments;

				if (parent.type !== 'CallExpression') {
					expression = {
						type: 'ExpressionStatement',
						expression: expression
					};
				}

				parent._context.push(expression);
			}
		}
	});

	return newAst;
}


function codeGenerator(node) {
	switch(node.type) {
		case 'Program':
			return node.body.map(codeGenerator).join('\n');

		case 'ExpressionStatement':
			return codeGenerator(node.expression);

		case 'CallExpression':

			const filteredLabels = AllowedLabels.filter((v) => v.name === node.callee.name);
			if (filteredLabels.length < 1 && !createdFunctions.includes(node.callee.name)) throw new TypeError('Unknown function ' + node.callee.name);
			const labelObj = filteredLabels.length < 1 ? createdFunctionObject : filteredLabels[0];

			return labelObj.codeGeneration(node.callee.name, node.arguments.map((v: any) => `${codeGenerator(v)}`));
		
		case 'NumberLiteral':
		case 'ConstantLiteral':
		case 'CreatedFunctionLiteral':
			return node.value;
		
		default: throw new TypeError(node.type);
	}
}

function compiler(input) {
	let tokens = lexer(input);
	let ast = parser(tokens);
	let newAst = transformer(ast);
	let output = codeGenerator(newAst);

	return output;
}

const code = compiler(process.argv.slice(2).join(' '));

console.log(code + ' = ' + eval(code));