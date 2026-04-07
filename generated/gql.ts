/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  "mutation ActivateBot($id: ID!) {\n  activateBot(id: $id) {\n    ... on Bot {\n      id\n      status\n    }\n    ... on NotFoundError {\n      message\n    }\n  }\n}": typeof types.ActivateBotDocument;
  "mutation ApproveProposal($id: ID!) {\n  approveProposal(id: $id) {\n    ... on Proposal {\n      id\n      status\n    }\n    ... on NotFoundError {\n      message\n    }\n    ... on AuthError {\n      message\n    }\n  }\n}": typeof types.ApproveProposalDocument;
  "mutation CompleteOnboarding {\n  completeOnboarding\n}": typeof types.CompleteOnboardingDocument;
  "mutation ConnectBroker($brokerName: String!, $credentials: String!) {\n  connectBroker(brokerName: $brokerName, credentials: $credentials) {\n    ... on Account {\n      id\n      status\n      providerName\n    }\n    ... on ValidationError {\n      message\n      field\n      code\n    }\n  }\n}": typeof types.ConnectBrokerDocument;
  "mutation CreateBot($input: CreateBotInput!) {\n  createBot(input: $input) {\n    ... on Bot {\n      id\n      name\n      frame\n      status\n      allocationPct\n    }\n    ... on ValidationError {\n      message\n      field\n      code\n    }\n  }\n}": typeof types.CreateBotDocument;
  "mutation DeleteBot($id: ID!) {\n  deleteBot(id: $id) {\n    ... on Bot {\n      id\n      status\n    }\n    ... on NotFoundError {\n      message\n    }\n  }\n}": typeof types.DeleteBotDocument;
  "mutation PauseBot($id: ID!) {\n  pauseBot(id: $id) {\n    ... on Bot {\n      id\n      status\n    }\n    ... on NotFoundError {\n      message\n    }\n  }\n}": typeof types.PauseBotDocument;
  "mutation SkipProposal($id: ID!) {\n  skipProposal(id: $id) {\n    ... on Proposal {\n      id\n      status\n    }\n    ... on NotFoundError {\n      message\n    }\n    ... on AuthError {\n      message\n    }\n  }\n}": typeof types.SkipProposalDocument;
  "mutation UpdateBot($id: ID!, $input: UpdateBotInput!) {\n  updateBot(id: $id, input: $input) {\n    ... on Bot {\n      id\n      name\n      allocationPct\n      dailyMaxLoss\n      dailyMaxGain\n      updatedAt\n    }\n    ... on ValidationError {\n      message\n      field\n      code\n    }\n    ... on NotFoundError {\n      message\n    }\n  }\n}": typeof types.UpdateBotDocument;
  "query Account {\n  account {\n    id\n    status\n    providerName\n  }\n}": typeof types.AccountDocument;
  "query Balance {\n  balance {\n    totalValue\n    cashBalance\n    investedValue\n    dayPnl\n    dayPnlPercent\n  }\n}": typeof types.BalanceDocument;
  "query Bot($id: ID!) {\n  bot(id: $id) {\n    id\n    name\n    frame\n    status\n    allocationPct\n    dailyMaxLoss\n    dailyMaxGain\n    riskAttitude\n    tradeTempo\n    combatPatience\n    activePosition {\n      id\n      symbol\n      qty\n      avgEntryPrice\n      status\n      openedAt\n    }\n    proposals(status: PENDING) {\n      id\n      symbol\n      side\n      qty\n      limitPrice\n      rationaleText\n      status\n      expiresAt\n      createdAt\n    }\n    createdAt\n    updatedAt\n  }\n}": typeof types.BotDocument;
  "query Bots {\n  bots {\n    id\n    name\n    frame\n    status\n    allocationPct\n    dailyMaxLoss\n    dailyMaxGain\n    riskAttitude\n    tradeTempo\n    combatPatience\n    createdAt\n    updatedAt\n  }\n}": typeof types.BotsDocument;
  "query Me {\n  me {\n    id\n    email\n    auth0Id\n    createdAt\n    onboardingCompleted\n  }\n}": typeof types.MeDocument;
  "query Positions {\n  positions {\n    id\n    symbol\n    qty\n    avgEntryPrice\n    status\n    openedAt\n    closedAt\n    bot {\n      id\n      name\n    }\n  }\n}": typeof types.PositionsDocument;
  "query Proposals($status: ProposalStatus) {\n  proposals(status: $status) {\n    id\n    symbol\n    side\n    qty\n    limitPrice\n    rationaleText\n    status\n    expiresAt\n    createdAt\n    bot {\n      id\n      name\n    }\n  }\n}": typeof types.ProposalsDocument;
};
const documents: Documents = {
  "mutation ActivateBot($id: ID!) {\n  activateBot(id: $id) {\n    ... on Bot {\n      id\n      status\n    }\n    ... on NotFoundError {\n      message\n    }\n  }\n}":
    types.ActivateBotDocument,
  "mutation ApproveProposal($id: ID!) {\n  approveProposal(id: $id) {\n    ... on Proposal {\n      id\n      status\n    }\n    ... on NotFoundError {\n      message\n    }\n    ... on AuthError {\n      message\n    }\n  }\n}":
    types.ApproveProposalDocument,
  "mutation CompleteOnboarding {\n  completeOnboarding\n}":
    types.CompleteOnboardingDocument,
  "mutation ConnectBroker($brokerName: String!, $credentials: String!) {\n  connectBroker(brokerName: $brokerName, credentials: $credentials) {\n    ... on Account {\n      id\n      status\n      providerName\n    }\n    ... on ValidationError {\n      message\n      field\n      code\n    }\n  }\n}":
    types.ConnectBrokerDocument,
  "mutation CreateBot($input: CreateBotInput!) {\n  createBot(input: $input) {\n    ... on Bot {\n      id\n      name\n      frame\n      status\n      allocationPct\n    }\n    ... on ValidationError {\n      message\n      field\n      code\n    }\n  }\n}":
    types.CreateBotDocument,
  "mutation DeleteBot($id: ID!) {\n  deleteBot(id: $id) {\n    ... on Bot {\n      id\n      status\n    }\n    ... on NotFoundError {\n      message\n    }\n  }\n}":
    types.DeleteBotDocument,
  "mutation PauseBot($id: ID!) {\n  pauseBot(id: $id) {\n    ... on Bot {\n      id\n      status\n    }\n    ... on NotFoundError {\n      message\n    }\n  }\n}":
    types.PauseBotDocument,
  "mutation SkipProposal($id: ID!) {\n  skipProposal(id: $id) {\n    ... on Proposal {\n      id\n      status\n    }\n    ... on NotFoundError {\n      message\n    }\n    ... on AuthError {\n      message\n    }\n  }\n}":
    types.SkipProposalDocument,
  "mutation UpdateBot($id: ID!, $input: UpdateBotInput!) {\n  updateBot(id: $id, input: $input) {\n    ... on Bot {\n      id\n      name\n      allocationPct\n      dailyMaxLoss\n      dailyMaxGain\n      updatedAt\n    }\n    ... on ValidationError {\n      message\n      field\n      code\n    }\n    ... on NotFoundError {\n      message\n    }\n  }\n}":
    types.UpdateBotDocument,
  "query Account {\n  account {\n    id\n    status\n    providerName\n  }\n}":
    types.AccountDocument,
  "query Balance {\n  balance {\n    totalValue\n    cashBalance\n    investedValue\n    dayPnl\n    dayPnlPercent\n  }\n}":
    types.BalanceDocument,
  "query Bot($id: ID!) {\n  bot(id: $id) {\n    id\n    name\n    frame\n    status\n    allocationPct\n    dailyMaxLoss\n    dailyMaxGain\n    riskAttitude\n    tradeTempo\n    combatPatience\n    activePosition {\n      id\n      symbol\n      qty\n      avgEntryPrice\n      status\n      openedAt\n    }\n    proposals(status: PENDING) {\n      id\n      symbol\n      side\n      qty\n      limitPrice\n      rationaleText\n      status\n      expiresAt\n      createdAt\n    }\n    createdAt\n    updatedAt\n  }\n}":
    types.BotDocument,
  "query Bots {\n  bots {\n    id\n    name\n    frame\n    status\n    allocationPct\n    dailyMaxLoss\n    dailyMaxGain\n    riskAttitude\n    tradeTempo\n    combatPatience\n    createdAt\n    updatedAt\n  }\n}":
    types.BotsDocument,
  "query Me {\n  me {\n    id\n    email\n    auth0Id\n    createdAt\n    onboardingCompleted\n  }\n}":
    types.MeDocument,
  "query Positions {\n  positions {\n    id\n    symbol\n    qty\n    avgEntryPrice\n    status\n    openedAt\n    closedAt\n    bot {\n      id\n      name\n    }\n  }\n}":
    types.PositionsDocument,
  "query Proposals($status: ProposalStatus) {\n  proposals(status: $status) {\n    id\n    symbol\n    side\n    qty\n    limitPrice\n    rationaleText\n    status\n    expiresAt\n    createdAt\n    bot {\n      id\n      name\n    }\n  }\n}":
    types.ProposalsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "mutation ActivateBot($id: ID!) {\n  activateBot(id: $id) {\n    ... on Bot {\n      id\n      status\n    }\n    ... on NotFoundError {\n      message\n    }\n  }\n}",
): (typeof documents)["mutation ActivateBot($id: ID!) {\n  activateBot(id: $id) {\n    ... on Bot {\n      id\n      status\n    }\n    ... on NotFoundError {\n      message\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "mutation ApproveProposal($id: ID!) {\n  approveProposal(id: $id) {\n    ... on Proposal {\n      id\n      status\n    }\n    ... on NotFoundError {\n      message\n    }\n    ... on AuthError {\n      message\n    }\n  }\n}",
): (typeof documents)["mutation ApproveProposal($id: ID!) {\n  approveProposal(id: $id) {\n    ... on Proposal {\n      id\n      status\n    }\n    ... on NotFoundError {\n      message\n    }\n    ... on AuthError {\n      message\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "mutation CompleteOnboarding {\n  completeOnboarding\n}",
): (typeof documents)["mutation CompleteOnboarding {\n  completeOnboarding\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "mutation ConnectBroker($brokerName: String!, $credentials: String!) {\n  connectBroker(brokerName: $brokerName, credentials: $credentials) {\n    ... on Account {\n      id\n      status\n      providerName\n    }\n    ... on ValidationError {\n      message\n      field\n      code\n    }\n  }\n}",
): (typeof documents)["mutation ConnectBroker($brokerName: String!, $credentials: String!) {\n  connectBroker(brokerName: $brokerName, credentials: $credentials) {\n    ... on Account {\n      id\n      status\n      providerName\n    }\n    ... on ValidationError {\n      message\n      field\n      code\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "mutation CreateBot($input: CreateBotInput!) {\n  createBot(input: $input) {\n    ... on Bot {\n      id\n      name\n      frame\n      status\n      allocationPct\n    }\n    ... on ValidationError {\n      message\n      field\n      code\n    }\n  }\n}",
): (typeof documents)["mutation CreateBot($input: CreateBotInput!) {\n  createBot(input: $input) {\n    ... on Bot {\n      id\n      name\n      frame\n      status\n      allocationPct\n    }\n    ... on ValidationError {\n      message\n      field\n      code\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "mutation DeleteBot($id: ID!) {\n  deleteBot(id: $id) {\n    ... on Bot {\n      id\n      status\n    }\n    ... on NotFoundError {\n      message\n    }\n  }\n}",
): (typeof documents)["mutation DeleteBot($id: ID!) {\n  deleteBot(id: $id) {\n    ... on Bot {\n      id\n      status\n    }\n    ... on NotFoundError {\n      message\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "mutation PauseBot($id: ID!) {\n  pauseBot(id: $id) {\n    ... on Bot {\n      id\n      status\n    }\n    ... on NotFoundError {\n      message\n    }\n  }\n}",
): (typeof documents)["mutation PauseBot($id: ID!) {\n  pauseBot(id: $id) {\n    ... on Bot {\n      id\n      status\n    }\n    ... on NotFoundError {\n      message\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "mutation SkipProposal($id: ID!) {\n  skipProposal(id: $id) {\n    ... on Proposal {\n      id\n      status\n    }\n    ... on NotFoundError {\n      message\n    }\n    ... on AuthError {\n      message\n    }\n  }\n}",
): (typeof documents)["mutation SkipProposal($id: ID!) {\n  skipProposal(id: $id) {\n    ... on Proposal {\n      id\n      status\n    }\n    ... on NotFoundError {\n      message\n    }\n    ... on AuthError {\n      message\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "mutation UpdateBot($id: ID!, $input: UpdateBotInput!) {\n  updateBot(id: $id, input: $input) {\n    ... on Bot {\n      id\n      name\n      allocationPct\n      dailyMaxLoss\n      dailyMaxGain\n      updatedAt\n    }\n    ... on ValidationError {\n      message\n      field\n      code\n    }\n    ... on NotFoundError {\n      message\n    }\n  }\n}",
): (typeof documents)["mutation UpdateBot($id: ID!, $input: UpdateBotInput!) {\n  updateBot(id: $id, input: $input) {\n    ... on Bot {\n      id\n      name\n      allocationPct\n      dailyMaxLoss\n      dailyMaxGain\n      updatedAt\n    }\n    ... on ValidationError {\n      message\n      field\n      code\n    }\n    ... on NotFoundError {\n      message\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "query Account {\n  account {\n    id\n    status\n    providerName\n  }\n}",
): (typeof documents)["query Account {\n  account {\n    id\n    status\n    providerName\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "query Balance {\n  balance {\n    totalValue\n    cashBalance\n    investedValue\n    dayPnl\n    dayPnlPercent\n  }\n}",
): (typeof documents)["query Balance {\n  balance {\n    totalValue\n    cashBalance\n    investedValue\n    dayPnl\n    dayPnlPercent\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "query Bot($id: ID!) {\n  bot(id: $id) {\n    id\n    name\n    frame\n    status\n    allocationPct\n    dailyMaxLoss\n    dailyMaxGain\n    riskAttitude\n    tradeTempo\n    combatPatience\n    activePosition {\n      id\n      symbol\n      qty\n      avgEntryPrice\n      status\n      openedAt\n    }\n    proposals(status: PENDING) {\n      id\n      symbol\n      side\n      qty\n      limitPrice\n      rationaleText\n      status\n      expiresAt\n      createdAt\n    }\n    createdAt\n    updatedAt\n  }\n}",
): (typeof documents)["query Bot($id: ID!) {\n  bot(id: $id) {\n    id\n    name\n    frame\n    status\n    allocationPct\n    dailyMaxLoss\n    dailyMaxGain\n    riskAttitude\n    tradeTempo\n    combatPatience\n    activePosition {\n      id\n      symbol\n      qty\n      avgEntryPrice\n      status\n      openedAt\n    }\n    proposals(status: PENDING) {\n      id\n      symbol\n      side\n      qty\n      limitPrice\n      rationaleText\n      status\n      expiresAt\n      createdAt\n    }\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "query Bots {\n  bots {\n    id\n    name\n    frame\n    status\n    allocationPct\n    dailyMaxLoss\n    dailyMaxGain\n    riskAttitude\n    tradeTempo\n    combatPatience\n    createdAt\n    updatedAt\n  }\n}",
): (typeof documents)["query Bots {\n  bots {\n    id\n    name\n    frame\n    status\n    allocationPct\n    dailyMaxLoss\n    dailyMaxGain\n    riskAttitude\n    tradeTempo\n    combatPatience\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "query Me {\n  me {\n    id\n    email\n    auth0Id\n    createdAt\n    onboardingCompleted\n  }\n}",
): (typeof documents)["query Me {\n  me {\n    id\n    email\n    auth0Id\n    createdAt\n    onboardingCompleted\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "query Positions {\n  positions {\n    id\n    symbol\n    qty\n    avgEntryPrice\n    status\n    openedAt\n    closedAt\n    bot {\n      id\n      name\n    }\n  }\n}",
): (typeof documents)["query Positions {\n  positions {\n    id\n    symbol\n    qty\n    avgEntryPrice\n    status\n    openedAt\n    closedAt\n    bot {\n      id\n      name\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "query Proposals($status: ProposalStatus) {\n  proposals(status: $status) {\n    id\n    symbol\n    side\n    qty\n    limitPrice\n    rationaleText\n    status\n    expiresAt\n    createdAt\n    bot {\n      id\n      name\n    }\n  }\n}",
): (typeof documents)["query Proposals($status: ProposalStatus) {\n  proposals(status: $status) {\n    id\n    symbol\n    side\n    qty\n    limitPrice\n    rationaleText\n    status\n    expiresAt\n    createdAt\n    bot {\n      id\n      name\n    }\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
