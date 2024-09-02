// ** React Imports
import { ReactNode } from 'react'

// ** Types
import { buildAbilityFor, type ACLObj, type AppAbility } from 'src/configs/acl'
import BlankLayout from 'src/views/layouts/BlankLayout'
import NotAuthorized from 'src/pages/401'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import { AbilityContext } from '../acl/Can'

interface AclGuardProps {
  children: ReactNode
  authGuard?: boolean
  guestGuard?: boolean
  aclAbilities: ACLObj
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { aclAbilities, children, guestGuard = false, authGuard = true } = props
  const auth = useAuth()
  const permissions = auth.user?.role?.permissions ?? []
  let ability: AppAbility
  const router = useRouter()

  if (auth.user && !ability) {
    ability = buildAbilityFor(permissions, aclAbilities.subject)
  }

  //if gues guard or no guard is true or any errors page
  if (guestGuard || router.route === '/500' || router.route === '/404' || !authGuard) {
    if (auth.user && ability) {
      return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
    } else {
      return <>{children}</>
    }
  }

  // Check access off current user
  if (ability && auth.user && ability.can(aclAbilities.action, aclAbilities.subject)) {
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }

  return (
    <>
      <BlankLayout>
        <NotAuthorized />
      </BlankLayout>
    </>
  )
}

export default AclGuard
