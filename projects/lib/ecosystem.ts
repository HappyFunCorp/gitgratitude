import { EcosystemName, LockfileType } from "@prisma/client";

export type Ecosystem = {
  name: string;
  package_endpoint: string;
  enum: EcosystemName;
};

export type Parser = {
  parser_endpoint: string;
  ecosystem: EcosystemName;
  file_type: LockfileType;
};

export function lookupEcosystem(name: string): Ecosystem | null {
  console.log(`Looking up ecoystem ${name}`);

  switch (name) {
    case EcosystemName.rubygems:
      return {
        name,
        package_endpoint: process.env.ECO_RUBYGEMS_URL,
        enum: EcosystemName.rubygems,
      };
    case EcosystemName.npm:
      return {
        name,
        package_endpoint: process.env.ECO_NPM_URL,
        enum: EcosystemName.npm,
      };
    case EcosystemName.cocoapods:
      return {
        name,
        package_endpoint: process.env.ECO_COCOAPOD_URL,
        enum: EcosystemName.cocoapods,
      };
    default:
      console.log(`Unknown ecosystem ${name}`);
  }
}

export function lookupParser(filename: string): Parser | null {
  console.log(`Looking parse for ${filename}`);
  switch (filename) {
    case "Gemfile.lock":
      return {
        parser_endpoint: process.env.LOCK_GEMFILE_URL,
        ecosystem: EcosystemName.rubygems,
        file_type: LockfileType.gemfile,
      };
    case "yarn.lock":
      return {
        parser_endpoint: process.env.LOCK_YARNLOCK_URL,
        ecosystem: EcosystemName.npm,
        file_type: LockfileType.yarn,
      };
    case "package-lock.json":
      return {
        parser_endpoint: process.env.LOCK_PACKAGELOCK_URL,
        ecosystem: EcosystemName.npm,
        file_type: LockfileType.npm,
      };
    case "Podfile.lock":
      return {
        parser_endpoint: process.env.LOCK_PODLOCK_URL,
        ecosystem: EcosystemName.cocoapods,
        file_type: LockfileType.podlock,
      };
    default:
      console.log(`Unknown lockfile ${filename}`);
      return null;
  }
}
