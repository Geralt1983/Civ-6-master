-- DataExporter.lua - Fixed version with better error handling
function OnTurnBegin()
    local iPlayer = Game.GetLocalPlayer()
    if (iPlayer == -1) then return end
    
    local pPlayer = Players[iPlayer]
    if not pPlayer then return end
    
    local pPlayerConfig = PlayerConfigurations[iPlayer]
    if not pPlayerConfig then return end

    -- 1. GET GAME SPEED & ERA
    local speedTypeId = GameConfiguration.GetGameSpeedType()
    local gameSpeed = "GAMESPEED_STANDARD"
    if GameInfo.GameSpeeds[speedTypeId] then
        gameSpeed = GameInfo.GameSpeeds[speedTypeId].GameSpeedType or "GAMESPEED_STANDARD"
    end
    
    local eraIndex = pPlayer:GetEra()
    local eraName = "Ancient Era"
    if GameInfo.Eras[eraIndex] then
        eraName = GameInfo.Eras[eraIndex].Name or "Ancient Era"
    end

    -- 2. GATHER YIELDS
    local science = 0
    local culture = 0
    local gold = 0
    local faith = 0
    
    if pPlayer:GetTechs() then
        science = math.floor(pPlayer:GetTechs():GetScienceYield())
    end
    if pPlayer:GetCulture() then
        culture = math.floor(pPlayer:GetCulture():GetCultureYield())
    end
    if pPlayer:GetTreasury() then
        gold = math.floor(pPlayer:GetTreasury():GetGoldBalance())
    end
    if pPlayer:GetReligion() then
        faith = math.floor(pPlayer:GetReligion():GetFaithYield())
    end

    -- 3. SUM CITY YIELDS (Production/Food)
    local totalProd = 0
    local totalFood = 0
    local cities = pPlayer:GetCities()
    if cities then
        for i, pCity in cities:Members() do
            totalFood = totalFood + pCity:GetYield(0) -- 0 = Food
            totalProd = totalProd + pCity:GetYield(1) -- 1 = Production
        end
    end

    -- 4. ACTIVE RESEARCH
    local pTechs = pPlayer:GetTechs()
    local currentTechID = -1
    local techName = "None"
    local techProgress = 0
    local techTurns = 0
    
    if pTechs then
        currentTechID = pTechs:GetResearchingTech()
        if (currentTechID ~= -1) then
            local techInfo = GameInfo.Technologies[currentTechID]
            if techInfo and techInfo.Name then
                techName = techInfo.Name
            end
            local cost = pTechs:GetResearchCost(currentTechID)
            local current = pTechs:GetResearchProgress(currentTechID)
            if cost > 0 then 
                techProgress = math.floor((current / cost) * 100)
            end
            if science > 0 then 
                techTurns = math.ceil((cost - current) / science) 
            end
        end
    end

    -- 5. ACTIVE CIVIC
    local pCulture = pPlayer:GetCulture()
    local currentCivicID = -1
    local civicName = "None"
    local civicProgress = 0
    local civicTurns = 0

    if pCulture then
        currentCivicID = pCulture:GetProgressingCivic()
        if (currentCivicID ~= -1) then
            local civicInfo = GameInfo.Civics[currentCivicID]
            if civicInfo and civicInfo.Name then
                civicName = civicInfo.Name
            end
            local cost = pCulture:GetCultureCost(currentCivicID)
            local current = pCulture:GetCulturalProgress(currentCivicID)
            if cost > 0 then 
                civicProgress = math.floor((current / cost) * 100) 
            end
            if culture > 0 then 
                civicTurns = math.ceil((cost - current) / culture) 
            end
        end
    end

    -- 6. LEADER NAME
    local leaderName = "Unknown"
    if pPlayerConfig and pPlayerConfig:GetLeaderName() then
        leaderName = pPlayerConfig:GetLeaderName()
    end

    -- 7. CONSTRUCT JSON
    local json = "CIV_DATA_DUMP::{"
    json = json .. "'gameSpeed':'" .. gameSpeed .. "',"
    json = json .. "'turn':" .. Game.GetCurrentGameTurn() .. ","
    json = json .. "'era':'" .. eraName .. "',"
    json = json .. "'leader':'" .. leaderName .. "',"
    json = json .. "'yields':{"
        json = json .. "'science':" .. science .. ","
        json = json .. "'culture':" .. culture .. ","
        json = json .. "'faith':" .. faith .. ","
        json = json .. "'gold':" .. gold .. ","
        json = json .. "'production':" .. totalProd .. ","
        json = json .. "'food':" .. totalFood
    json = json .. "},"
    json = json .. "'currentResearch':{"
        json = json .. "'name':'" .. techName .. "',"
        json = json .. "'progress':" .. techProgress .. ","
        json = json .. "'turnsLeft':" .. techTurns .. ","
        json = json .. "'icon':'flask'"
    json = json .. "},"
    json = json .. "'currentCivic':{"
        json = json .. "'name':'" .. civicName .. "',"
        json = json .. "'progress':" .. civicProgress .. ","
        json = json .. "'turnsLeft':" .. civicTurns .. ","
        json = json .. "'icon':'scroll'"
    json = json .. "}"
    json = json .. "}"

    print(json)
end

Events.TurnBegin.Add(OnTurnBegin)
