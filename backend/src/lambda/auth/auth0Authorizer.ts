import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify/*, decode*/ } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
// import Axios from 'axios'
// import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = 'https://dev-e4vpei6e.auth0.com/.well-known/jwks.json';

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  // const jwt: Jwt = decode(token, { complete: true }) as Jwt
  const secret = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJZ4NREn2qmYMxMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi1lNHZwZWk2ZS5hdXRoMC5jb20wHhcNMTkxMTE3MTczNjMzWhcNMzMw
NzI2MTczNjMzWjAhMR8wHQYDVQQDExZkZXYtZTR2cGVpNmUuYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr6syXJLBf3jB+eFCrlJRGzxv
pX8Tr2KnQF/hwKAuj3f/oVaIrSIZ0UMQCnIJXpdO83/u+bLDxIRAtY5bSYqbk3nU
tlH/RqtISaBAaaJG7vMtLQdbK6DsO3ZYDJyRhmwwt/sHdYhe6jYWc/G2Q6RNa1Ea
F608yxD2woFDsNUaViL34w4/UIct2hsFY9xUBE+V3kFp/6on6KCD/s300pP625/R
Rn71dsRq+aOgWGWWmJutQtIOrLthwgyT7ioVDO5fWaPDlTDWjppm7N1QmJ6HGS3N
XxI9QYsWz5ofvVjdbgNWwR4cYz2/ALLey0l3eM03yJXZOtrfsX43iwyVE3luUwID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSQV8HiYiacfJGBHDrG
BZicYWn5oDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAHqLjShd
56dcdPxeHrIfWeGIteDxQcg5ghHj9LWhYJ5tPkGecVkSMRqciiG+n7h6HnMVrJQ7
8fR40Np/ogWLpcGsnnJsI7MlTE9ZLBYff2OXTiglb4Dq8Sfa6cYpaLn9bssDLlZ3
tKyUAk3gWDIBniafJMhs3CqXB7fQWtflfpQ/n6YmcPFdFZjP5EOdapq4prEVvFfL
ILTwDzfFOIiSXnPzlopYCELBOl3nFEAvJ8ZYhMBhL6wVUWRU2D1ZJjTYYtsf/1Dl
GehUiWLi1/BUYBbHUzhFHAbxKEAQApzu9ZjiUAvNGxBhCpo3gMws4hiE6CV8JqCZ
tr5JNABsc5/99bc=
-----END CERTIFICATE-----
`

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return verify(token, secret, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
