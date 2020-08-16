const express = require('express')
const { graphqlHTTP } = require("express-graphql");
const {

    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull

} = require('graphql')


const app = express()

const colegas = [

    {id:1, name: 'Julio Fraga'},
    {id:2, name: 'Curupira'},
    {id:3, name: 'Vitor Daniel'}

]
const regioes = [

    {id:1, name:'Sul', idColega:1},
    {id:2, name:'Nordeste', idColega:3},
    {id:3, name:'Norte', idColega:2}

]

const RegioesType = new GraphQLObjectType({

    name: 'Regiao',
    description: 'Isso representa uma região que um colega habita',
    fields: () => ({

        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        idColega: {type: GraphQLNonNull(GraphQLInt)},
        colega: {

            type: ColegaType,
            resolve: (regiao) => {
                return colegas.find(colega => colega.id === regiao.idColega)
            }

        }

    })

})
const ColegaType = new GraphQLObjectType({

    name: 'Colega',
    description: 'Isso representa um= colega',
    fields: () => ({

        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        regioes: {

            type: new GraphQLList(RegioesType),
            resolve: (colega) => {

                return regioes.filter(regiao => regiao.idColega === colega.id)

            }

        }

    })

})

const RootQueryType = new GraphQLObjectType({

    name:'Query',
    description: 'Root Query',
    fields: () => ({

        regiao:{

            type: RegioesType,
            description: 'Uma regiao',
            args: {

                id:{type: GraphQLInt}

            },
            resolve: (parent, args) => regioes.find(regiao => regiao.id === args.id)

        },
        regioes: {

            type: GraphQLList(RegioesType),
            description: 'Lista de regiões',
            resolve: () => regioes

        },
        colega: {

            type: ColegaType,
            description: 'Um colega específico',
            args: {

                id:{type: GraphQLInt}

            },
            resolve: (parent, args) => colegas.find(colega => colega.id === args.id)

        },
        colegas: {

            type: GraphQLList(ColegaType),
            description: 'Lista de colegas',
            resolve: () => colegas

        }

    })

})

const RootMutationType = new GraphQLObjectType({

    name: 'Mutation',
    description: 'Root mutation',
    fields: () => ({

        addRegiao: {

            type: RegioesType,
            description: 'Adicionar uma regiao',
            args:{

                name:{type: GraphQLNonNull(GraphQLString)},
                idColega: {type: GraphQLNonNull(GraphQLInt)}

            },
            resolve: (parent, args) => {

                const regiao = {id: regioes.length + 1, name: args.name, idColega: args.idColega}
                regioes.push(regiao)
                return regiao

            }

        },
        addColega: {

            type: ColegaType,
            description: 'Adicionar um colega',
            args:{

                name:{type: GraphQLNonNull(GraphQLString)}

            },
            resolve: (parent, args) => {

                const colega = {id: colegas.length + 1, name: args.name}
                colegas.push(colega)
                return colega

            }

        }

    })

})

const schema = new GraphQLSchema({

    query: RootQueryType,
    mutation: RootMutationType

})

app.use('/graphql', graphqlHTTP({

    schema: schema,
    graphiql: true

}))
app.listen(5000, ()=> console.log('Server Running!'))