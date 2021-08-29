import development from './env.dev';
import production from './env.demo';

// ----------------------------------------------------------------------------
// Module Vars
// ----------------------------------------------------------------------------
const env = process.env.NODE_ENV as string

const config = {
    development,
    production,
}[env];

export {
    config
};
